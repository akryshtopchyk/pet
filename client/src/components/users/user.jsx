import { Col, Row, Table, Button, Modal, Input } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const { TextArea } = Input;

const User = () => {
  let { id } = useParams();
  const [data, setData] = useState({});
  const [user, setUser] = useState({});
  const [load, setLoad] = useState(true);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await axios.get(
        `${import.meta.env.VITE_ROUTE}passenger/${id}`,
      );
      setUser({ ...userRes.data.existingPassenger });
      setNote(userRes.data.existingPassenger.note);
      const orders = await axios.get(
        `${import.meta.env.VITE_ROUTE}order/info/${
          userRes.data.existingPassenger.phoneNumber
        }`,
      );
      if (orders.status === 200) {
        const { orderData, deletedOrderData } = orders.data.orderData;
        const ordersData = orderData
          .map((el) => {
            return { ...el, isDeleted: false };
          })
          .concat(
            deletedOrderData.map((el) => {
              return { ...el, isDeleted: true };
            }),
          );
        setData(
          ordersData
            .map((el) => {
              const date = el.date ? new Date(el.date) : '';
              return {
                key: el._id,
                firstName: el.firstName,
                lastName: el.lastName,
                phoneNumber: el.phoneNumber,
                count: el.seatCount,
                description: el.description,
                fromStop: el.fromStop,
                toStop: el.toStop,
                orderDate: date,
                tripId: el.tripId,
                date: date ? date.toLocaleString('ru-RU') : '',
                isDeleted: el.isDeleted === true ? 'да' : 'нет',
                isApproved: el.isApproved === true ? 'да' : 'нет',
              };
            })
            .sort(
              (a, b) =>
                new Date(b.orderDate).getTime() -
                new Date(a.orderDate).getTime(),
            ),
        );
      } else {
        setData([]);
      }
      setLoad(false);
    };
    fetchData().catch(console.error);
  }, []);

  const handleUpdateNote = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_ROUTE}passenger/${user._id}`, {
        note: note,
      });
      alert('Обновлен');
    } catch (e) {
      console.log(e);
      alert('Ошибка');
    }
  };

  const handleOk = async () => {
    setLoad(true);
    setIsBlockModalOpen(false);
    const res = await axios.put(
      `${import.meta.env.VITE_ROUTE}passenger/${user._id}`,
      {
        isBlock: !user.isBlock,
      },
    );
    if (res.status === 200) {
      const userRes = await axios.get(
        `${import.meta.env.VITE_ROUTE}passenger/${id}`,
      );
      setUser({ ...userRes.data.existingPassenger });
      const orders = await axios.get(
        `${import.meta.env.VITE_ROUTE}order/info/${
          userRes.data.existingPassenger.phoneNumber
        }`,
      );
      if (orders.status === 200) {
        const { orderData, deletedOrderData } = orders.data.orderData;
        const ordersData = orderData
          .map((el) => {
            return { ...el, isDeleted: false };
          })
          .concat(
            deletedOrderData.map((el) => {
              return { ...el, isDeleted: true };
            }),
          );
        setData(
          ordersData
            .map((el) => {
              const date = el.date ? new Date(el.date) : '';
              return {
                key: el._id,
                firstName: el.firstName,
                lastName: el.lastName,
                phoneNumber: el.phoneNumber,
                count: el.seatCount,
                description: el.description,
                fromStop: el.fromStop,
                toStop: el.toStop,
                orderDate: date,
                tripId: el.tripId,
                date: date ? date.toLocaleString('ru-RU') : '',
                isDeleted: el.isDeleted === true ? 'да' : 'нет',
                isApproved: el.isApproved === true ? 'да' : 'нет',
              };
            })
            .sort(
              (a, b) =>
                new Date(b.orderDate).getTime() -
                new Date(a.orderDate).getTime(),
            ),
        );
      } else {
        setData([]);
      }
    }
    setLoad(false);
  };

  const handleCancel = () => {
    setIsBlockModalOpen(false);
  };

  const handleBlock = () => {
    setIsBlockModalOpen(true);
  };

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
      title: 'Количество мест',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Посадка',
      dataIndex: 'fromStop',
      key: 'fromStop',
    },
    {
      title: 'Высадка',
      dataIndex: 'toStop',
      key: 'toStop',
    },
    {
      title: 'Пометка',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Удален',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
    },
    {
      title: 'Потвержденная',
      dataIndex: 'isApproved',
      key: 'isApproved',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <>
          <Link to={`/trips/${record.tripId}`}>О поездке</Link>
        </>
      ),
    },
  ];

  if (load) {
    return 'загрузка';
  }

  const rowClassName = (record) => {
    return record.isDeleted === 'да' ? 'deleted' : '';
  };

  return (
    <>
      <Row>
        <Col span={2}>
          <Link style={{ fontSize: 24 }} to="/Users">
            Назад
          </Link>
        </Col>
      </Row>
      <Row>
        имя фамилия: {user.firstName} {user.lastName}
      </Row>
      <Row>телефон: {user.phoneNumber}</Row>
      <Row>заблокирован: {user.isBlock === true ? 'да' : 'нет'}</Row>
      <Row>
        <Button type="primary" danger onClick={handleBlock}>
          {user.isBlock === true ? `Разблокировать?` : 'Заблокировать?'}
        </Button>
      </Row>
      <Row>
        <h3>Заметка</h3>
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Заметка"
          autoSize={{ minRows: 3, maxRows: 100 }}
        />
        <Button type="primary" onClick={handleUpdateNote}>
          Обновить
        </Button>
      </Row>
      <Row>
        <Col span={24}>
          <h3>Поездки</h3>
        </Col>
      </Row>
      <div style={{ margin: '24px 0' }} />
      <div style={{ margin: '24px 0' }} />
      <Table columns={columns} dataSource={data} rowClassName={rowClassName} />
      <Modal
        title={user.isBlock === true ? `Разблокировать?` : 'Заблокировать?'}
        open={isBlockModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
    </>
  );
};

export default User;
