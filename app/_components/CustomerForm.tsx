"use client";

import { useRouter } from "next/navigation";
import { Button, Form, Input, FormProps } from 'antd';
import agent from "../api/agent";

interface CustomerFormProps {
  selectedSeatId: string; 
}

const CustomerForm = ({ selectedSeatId }: CustomerFormProps) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish: FormProps<CustomerFormProps>["onFinish"] = async (values) => {
    try {
      // Create the customer first using the form values
      const customerResponse = await agent.Customers.create({
        name: values.name,
        TCNumber: values.TCNumber,
        phone: values.phone,
        email: values.email,
        address: values.address,
        birthDate: values.birthDate,
      });


      const customerId = customerResponse.id; 

      await agent.Tickets.buyTicket({
        customerId: customerId,
        seatId: selectedSeatId,
      });
      
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-7xl px-10 lg:px-20 mx-auto py-12">
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
          label="İsim"
          name="name"
          rules={[{ required: true, message: 'Lütfen isminizi girin!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="TC Kimlik No"
          name="TCNumber"
          rules={[{ required: true, message: 'Lütfen TC Kimlik numaranızı girin!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Telefon"
          name="phone"
          rules={[{ required: true, message: 'Lütfen telefon numaranızı girin!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Lütfen email adresinizi girin!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Adres"
          name="address"
          rules={[{ required: true, message: 'Lütfen adresinizi girin!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Doğum Tarihi"
          name="birthDate"
          rules={[{ required: true, message: 'Lütfen doğum tarihinizi girin!' }]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit">
            Bilet Oluştur
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomerForm;
