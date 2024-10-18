import { Button, DatePicker, Form, FormProps, Input, Modal, QRCode } from "antd";
import agent from "../api/agent";
import { CustomerFormValues } from "../models/customer";
import { useEffect, useState } from "react";
import { Activity } from "../models/activity";
import { TicketSeat } from "../models/ticketseat";
import jsPDF from "jspdf"; 
import locale from 'antd/es/date-picker/locale/tr_TR';
import Link from "next/link";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import router from "next/router";

dayjs.extend(utc);
dayjs.extend(timezone);
interface CustomerFormProps {
  activityId: string;
  selectedSeatId: string;
}

const CustomerForm = ({ activityId, selectedSeatId }: CustomerFormProps) => {
  const [form] = Form.useForm();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [ticketSeat, setTicketSeat] = useState<TicketSeat | null>(null);
  const [ticketInfo, setTicketInfo] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const activityDetails = await agent.Activities.details(activityId);
        setActivity(activityDetails);
        const ticketSeatDetails = await agent.TicketSeats.details(selectedSeatId);
        setTicketSeat(ticketSeatDetails);
      } catch (error) {
        console.error('Error fetching event hall details:', error);
      }
    };

    fetchSeats();
  }, [activityId]);

  const onFinish: FormProps<CustomerFormValues>["onFinish"] = async (values) => {
    try {
      const customerResponse = await agent.Customers.create({
        name: values.name,
        TCNumber: values.TCNumber,
        phone: values.phone,
        email: values.email,
        address: values.address,
        birthDate: values.birthDate,
      });
  
      const customerId = customerResponse.id;
      
      if (!customerId) {
        throw new Error('Customer ID not returned');
      }

      const ticketResponse = await agent.Tickets.buyTicket({
        customerId: customerId,
        ticketSeatId: selectedSeatId,
        activityId: activityId,
      });

      setTicketInfo({
        ...values,
        activityId,
        activity,
        ticketSeat,
        ticketId: ticketResponse.id,
      });

      setIsModalVisible(true);
  
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    router.push('/'); 
  };


  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Bilet Detayları", 20, 20);

    const qrCodeCanvas = document.querySelector("canvas") as HTMLCanvasElement;
    const qrCodeURL = qrCodeCanvas.toDataURL("image/png");
    doc.addImage(qrCodeURL, "PNG", 150, 10, 40, 40); 

    doc.setFontSize(12);
  
    doc.text(`Ad Soyad: ${ticketInfo?.name}`, 20, 50);
    doc.text(`Telefon: ${ticketInfo?.phone}`, 20, 60);
    doc.text(`Telefon: ${ticketInfo?.email}`, 20, 70);
    doc.text(`Etkinlik: ${ticketInfo?.activity.name}`, 20, 80);
    doc.text(`Etkinlik Yeri: ${ticketInfo?.activity.place.title}`, 20, 90);
    doc.text(`Koltuk No: ${ticketInfo?.ticketSeat.label}`, 20, 100);
  

    doc.save(`bilet_${ticketInfo.ticketId}.pdf`);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-7xl px-10 lg:px-20 mx-auto py-12">
      <div className='flex flex-row justify-between w-full items-center px-6'>
      <div className='flex flex-row items-center justify-center pb-8 gap-4'>
          <div className='w-16 h-16 rounded-full border-4 border-[#16a89d]/50 text-white flex items-center justify-center text-3xl font-bold'>1</div>
          <div className='flex flex-col items-start justify-start text-white'>
            <p className='font-semibold text-2xl'>Etkinlik Detayları</p>
            <p>{activity?.name}</p>
            <p>{dayjs.utc((activity?.date)).tz('Europe/Istanbul').format('DD.MM.YYYY HH:mm')}</p>
            <p>Etkinlik Yeri: {activity?.place.title!}</p>
            <p>Etkinlik Süresi: {activity?.duration!} dk</p>
          </div>
        </div>
        <div className='flex flex-row items-center justify-center pb-8 gap-4'>
          <Link className='w-16 h-16 rounded-full border-4 border-[#16a89d]/50 text-white flex items-center justify-center text-3xl font-bold' href='/'>2</Link>
          <div className='flex flex-col items-start justify-start text-white'>
            <p className='font-semibold text-2xl'>Koltuk Seçimi</p>
            {ticketSeat && <p>Seçilen Koltuk: {ticketSeat.label}</p>} 
          </div>
        </div>
        <div className='flex flex-row items-center justify-center pb-8 gap-4'>
          <div className='w-16 h-16 rounded-full border-4 border-transparent bg-[#16a89d]/50  text-white flex items-center justify-center text-3xl font-bold'>3</div>
          <div className='flex flex-col items-start justify-start text-white'>
            <p className='font-semibold text-2xl'>Kişisel Bilgiler</p>
          </div>
        </div>
      </div>
      <div className="p-10 rounded-3xl drop-shadow-xl bg-slate-50 text-black w-full text-black">
        <Form
          layout='horizontal'
          form={form}
          onFinish={onFinish}
          initialValues={{ layout: 'horizontal' }}
          style={{ maxWidth: 800 }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            name="name"
            label="Ad Soyad"
            rules={[{ required: true, message: 'Ad Soyad gereklidir!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="TCNumber"
            label="TC Kimlik No"
            rules={[{ required: true, message: 'TC Kimlik No gereklidir!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Telefon"
            rules={[{ required: true, message: 'Telefon gereklidir!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-posta"
            rules={[{ required: true, message: 'E-posta gereklidir!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Adres"
            rules={[{ required: true, message: 'Adres gereklidir!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Doğum Tarihi" name={"birthDate"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
                        <DatePicker
                            format="DD.MM.YYYY"
                            placeholder='Tarih seçiniz'
                            showNow={false}
                            locale={locale}
                        />
                    </Form.Item>
          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <button className="px-4 py-2 bg-[#16a89d] text-white rounded-full text-xl hover:bg-opacity-75" type="submit">
              Bilet Al
            </button>
          </Form.Item>
        </Form>
        <Modal
          title="Biletiniz"
          open={isModalVisible}
          onCancel={handleModalClose} 
          footer={[
            <Button key="download" type="primary" onClick={generatePDF}>
              PDF Olarak İndir
            </Button>,
          ]}
        >
          {ticketInfo && (
            <div>
              <p><strong>Ad Soyad:</strong> {ticketInfo.name}</p>
              <p><strong>Telefon:</strong> {ticketInfo.phone}</p>
              <p><strong>Etkinlik:</strong> {ticketInfo.activity.name}</p>
              <p><strong>Etkinlik Yeri:</strong> {ticketInfo.activity.place.title}</p>
              <p><strong>Koltuk No:</strong> {ticketInfo.ticketSeat.label}</p>
              <QRCode value={`Ticket ID: ${ticketInfo.ticketId}`} size={200} />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CustomerForm;
