import { Table, Button, Modal } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const UsersIndex = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedUser, setDeletedUser] = useState({});
  const [data, setData] = useState([]);

  const handleDelete = (key) => {
    setIsModalOpen(true);
    setDeletedUser(data.find((el) => el.key === key));
  };

  const handleOk = async () => {
    const res = await axios.delete(
      `${import.meta.env.VITE_ROUTE}passenger/${deletedUser.key}`,
    );
    if (res.status === 200) {
      const data = await axios.get(`${import.meta.env.VITE_ROUTE}passenger`);
      if (data.status === 200) {
        const passengerData = data.data.passengerData;
        setData(
          passengerData.map((el) => ({
            key: el._id,
            firstName: el.firstName,
            lastName: el.lastName,
            phoneNumber: el.phoneNumber,
          })),
        );
      } else {
        setData([]);
      }
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`${import.meta.env.VITE_ROUTE}passenger`);
      if (data.status === 200) {
        const passengerData = data.data.passengerData;
        setData(
          passengerData.map((el) => ({
            key: el._id,
            firstName: el.firstName,
            lastName: el.lastName,
            phoneNumber: el.phoneNumber,
          })),
        );
      } else {
        setData([]);
      }
    };
    fetchData().catch(console.error);
  }, []);

  const columns = [
    {
      title: 'Имя',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Фамилия',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.key)}>
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} />
      <Modal
        title={`Удалить ${deletedUser.firstName} ${deletedUser.lastName}?`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
    </>
  );
};

export default UsersIndex;
