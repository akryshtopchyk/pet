import {
  Col,
  Row,
  Button,
  Table,
  Input,
  Card,
  Modal,
  Select,
  InputNumber,
} from 'antd';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
const { TextArea } = Input;

const Trip = () => {
  const [isNewPassenger, setIsNewPassenger] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedOrder, setDeletedOrder] = useState({});

  let { id } = useParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [count, setCount] = useState('');
  const [fromStop, setFromStop] = useState();
  const [toStop, setToStop] = useState();
  const [description, setDescription] = useState('');
  const [data, setData] = useState([]);
  const [trip, setTrip] = useState({});
  const [load, setLoad] = useState(true);
  const [stops, setStops] = useState({});
  const [deleted, setDeleted] = useState([]);
  const [newPlaceCount, setNewPlaceCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const deleted = await axios.get(
        `${import.meta.env.VITE_ROUTE}order/deleted/${id}`,
      );
      if (deleted.status === 200) {
        const deletedData = deleted.data.orderData;
        setDeleted(
          deletedData.map((el) => {
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
              date: date ? date.toLocaleString('ru-RU') : '',
            };
          }),
        );
      } else {
        setDeleted([]);
      }
      const data = await axios.get(`${import.meta.env.VITE_ROUTE}order/${id}`);
      if (data.status === 200) {
        const orderData = data.data.orderData;
        setData(
          orderData.map((el) => {
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
              date: date ? date.toLocaleString('ru-RU') : '',
            };
          }),
        );
      } else {
        setData([]);
      }
      const trip = await axios.get(`${import.meta.env.VITE_ROUTE}trip/${id}`);
      if (trip.status === 200) {
        const tripData = trip.data.existingTrip;
        setNewPlaceCount(tripData.seatCount);
        setTrip({
          id: tripData._id,
          date: tripData.date,
          from: tripData.from,
          to: tripData.to,
          sum: tripData.sum,
          arrivalTime: tripData.arrivalTime,
          departureTime: tripData.departureTime,
          seatCount: tripData.seatCount,
          orders: tripData.orders,
        });
      } else {
        setTrip({});
      }
      const stops = await axios.get(`${import.meta.env.VITE_ROUTE}order/stops`);
      if (stops.status === 200) {
        setStops(stops.data.orderData);
      } else {
        setTrip({});
      }
      setLoad(false);
    };
    fetchData().catch(console.error);
  }, []);

  const changeNewPlaceCount = (value) => {
    setNewPlaceCount(value);
  };
  const changeFirstName = (value) => {
    setFirstName(value.target.value);
  };
  const changeLastName = (value) => {
    setLastName(value.target.value);
  };
  const changePhoneNumber = (value) => {
    setPhoneNumber(value.target.value);
  };
  const changeCount = (value) => {
    setCount(value.target.value);
  };
  const changeFromStop = (value) => {
    setFromStop(value);
  };
  const changeToStop = (value) => {
    setToStop(value);
  };
  const changeDescription = (value) => {
    setDescription(value.target.value);
  };

  const handleDelete = (key) => {
    setIsModalOpen(true);
    setDeletedOrder(data.find((el) => el.key === key));
  };

  const handleOk = async () => {
    const res = await axios.delete(
      `${import.meta.env.VITE_ROUTE}order/${deletedOrder.key}`,
    );
    if (res.status === 200) {
      const data = await axios.get(`${import.meta.env.VITE_ROUTE}order/${id}`);
      if (data.status === 200) {
        const orderData = data.data.orderData;
        setData(
          orderData.map((el) => {
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
              date: date ? date.toLocaleString('ru-RU') : '',
            };
          }),
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
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.key)}>
          Удалить
        </Button>
      ),
    },
  ];
  const deletedColumns = [
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
      title: 'Дата удаления',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const showNewPassenger = () => {
    setIsNewPassenger(!isNewPassenger);
  };

  const updatePlaceCount = async () => {
    console.log(newPlaceCount);
    await axios.put(`${import.meta.env.VITE_ROUTE}trip/${id}`, {
      seatCount: newPlaceCount,
    });
    const trip = await axios.get(`${import.meta.env.VITE_ROUTE}trip/${id}`);
    if (trip.status === 200) {
      const tripData = trip.data.existingTrip;
      setNewPlaceCount(tripData.seatCount);
      setTrip({
        id: tripData._id,
        date: tripData.date,
        from: tripData.from,
        to: tripData.to,
        sum: tripData.sum,
        arrivalTime: tripData.arrivalTime,
        departureTime: tripData.departureTime,
        seatCount: tripData.seatCount,
        orders: tripData.orders,
      });
    } else {
      setTrip({});
    }
  };

  const getFromStops = (from, to) => {
    if (from === 'minsk' && to === 'ivanovo') {
      return stops.fromMinskToIvanovo;
    }
    if (from === 'grodno' && to === 'ivanovo') {
      return stops.fromGrodnoToIvanovo;
    }
    if (from === 'ivanovo' && to === 'grodno') {
      return stops.fromIvanovoToGrodno;
    }
    if (from === 'ivanovo' && to === 'minsk') {
      return stops.fromIvanovoToMinsk;
    }
  };
  const getToStops = (from, to) => {
    if (from === 'minsk' && to === 'ivanovo') {
      return stops.toIvanovoFromMinsk;
    }
    if (from === 'grodno' && to === 'ivanovo') {
      return stops.toIvanovoFromGrodno;
    }
    if (from === 'ivanovo' && to === 'grodno') {
      return stops.toGrodnoFromIvanovo;
    }
    if (from === 'ivanovo' && to === 'minsk') {
      return stops.toMinskFromIvanovo;
    }
  };

  const createPassenger = async () => {
    if (
      firstName &&
      lastName &&
      phoneNumber &&
      count &&
      fromStop &&
      toStop &&
      description
    ) {
      const fromStops = getFromStops(trip.from, trip.to);
      const fromStopV = fromStops.find((stop) => stop.id === fromStop);
      const toStops = getToStops(trip.from, trip.to);
      const toStopV = toStops.find((stop) => stop.id === toStop);
      const res = await axios.post(`${import.meta.env.VITE_ROUTE}order`, {
        firstName,
        lastName,
        phoneNumber,
        description,
        tripId: id,
        fromStop: fromStopV.name,
        fromStopTime: fromStopV.time.toString(),
        toStop: toStopV.name,
        toStopTime: toStopV.time.toString(),
        seatCount: +count,
      });
      if (res.status === 201) {
        const data = await axios.get(
          `${import.meta.env.VITE_ROUTE}order/${id}`,
        );
        if (data.status === 200) {
          const orderData = data.data.orderData;
          setData(
            orderData.map((el) => {
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
                date: date ? date.toLocaleString('ru-RU') : '',
              };
            }),
          );
        } else {
          setData([]);
        }
      }
      setIsNewPassenger(!isNewPassenger);
    }
  };

  const getTripTitle = (from, to) => {
    let newFrom, newTo;
    switch (from) {
      case 'minsk':
        newFrom = 'Минск';
        break;
      case 'ivanovo':
        newFrom = 'Иваново';
        break;
      case 'grodno':
        newFrom = 'Гродно';
        break;
    }
    switch (to) {
      case 'minsk':
        newTo = 'Минск';
        break;
      case 'ivanovo':
        newTo = 'Иваново';
        break;
      case 'grodno':
        newTo = 'Гродно';
        break;
    }
    return `${newFrom} - ${newTo}`;
  };
  const getFromStopsTitles = (from, to) => {
    if (from === 'minsk' && to === 'ivanovo') {
      return stops.fromMinskToIvanovo.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
    if (from === 'grodno' && to === 'ivanovo') {
      return stops.fromGrodnoToIvanovo.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
    if (from === 'ivanovo' && to === 'grodno') {
      return stops.fromIvanovoToGrodno.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
    if (from === 'ivanovo' && to === 'minsk') {
      return stops.fromIvanovoToMinsk.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
  };
  const getToStopsTitles = (from, to) => {
    if (from === 'minsk' && to === 'ivanovo') {
      return stops.toIvanovoFromMinsk.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
    if (from === 'grodno' && to === 'ivanovo') {
      return stops.toIvanovoFromGrodno.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
    if (from === 'ivanovo' && to === 'grodno') {
      return stops.toGrodnoFromIvanovo.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
    if (from === 'ivanovo' && to === 'minsk') {
      return stops.toMinskFromIvanovo.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
  };

  if (load) {
    return 'загрузка';
  }
  return (
    <>
      <Row>
        <Col span={2}>
          <Link style={{ fontSize: 24 }} to="/trips">
            Назад
          </Link>
        </Col>
        <Col style={{ fontSize: 24 }} span={6}>
          {getTripTitle(trip.from, trip.to)}
        </Col>
        <Col style={{ fontSize: 24 }} span={4}>
          {`${new Date(trip.date).getDate()}.${
            new Date(trip.date).getMonth() + 1
          }.${new Date(trip.date).getFullYear()} ${trip.departureTime}`}
        </Col>
        <Col style={{ fontSize: 24 }} span={4}>
          всего места: {trip.seatCount}
        </Col>
        <Col style={{ fontSize: 24 }} span={4}>
          осталось: {trip.seatCount - trip.orders}
        </Col>
        <Col style={{ fontSize: 24 }} span={4}>
          цена поездки: {trip.sum}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <h3>Пасажиры</h3>
        </Col>
      </Row>
      <Row style={{ marginBottom: '16px' }}>
        <Card title="Новое кол-во мест" style={{ width: '250px' }}>
          <Row>
            <InputNumber
              placeholder="Новое кол-во мест"
              value={newPlaceCount}
              onChange={changeNewPlaceCount}
            />
            <Button
              type="primary"
              onClick={updatePlaceCount}
              style={{ marginLeft: '12px' }}
            >
              Обновить
            </Button>
          </Row>
        </Card>
      </Row>
      <Row>
        <Col span={24}>
          <Button type="primary" onClick={showNewPassenger}>
            Добавить пассажира
          </Button>
        </Col>
      </Row>
      <div style={{ margin: '24px 0' }} />
      <Row style={{ display: isNewPassenger ? 'block' : 'none' }}>
        <Card title="Новый пасажир" style={{ width: '100%' }}>
          <TextArea
            placeholder="Имя"
            autoSize
            value={firstName}
            onChange={changeFirstName}
          />
          <div style={{ margin: '24px 0' }} />
          <TextArea
            placeholder="Фамилия"
            autoSize
            value={lastName}
            onChange={changeLastName}
          />
          <div style={{ margin: '24px 0' }} />
          <TextArea
            placeholder="Номер телефона"
            autoSize
            value={phoneNumber}
            onChange={changePhoneNumber}
          />
          <div style={{ margin: '24px 0' }} />
          <TextArea
            placeholder="Количество мест"
            autoSize
            value={count}
            onChange={changeCount}
          />
          <div style={{ margin: '24px 0' }} />
          <h4 className="new_trip_subtitles">Посадка</h4>
          <Select
            style={{ width: '100%' }}
            onChange={changeFromStop}
            options={getFromStopsTitles(trip.from, trip.to)}
          />
          <h4 className="new_trip_subtitles">Высадка</h4>
          <Select
            style={{ width: '100%' }}
            onChange={changeToStop}
            options={getToStopsTitles(trip.from, trip.to)}
          />
          <div style={{ margin: '24px 0' }} />
          <TextArea
            placeholder="Пометка"
            autoSize
            value={description}
            onChange={changeDescription}
          />
          <div style={{ margin: '24px 0' }} />
          <Button type="primary" onClick={createPassenger}>
            Добавить
          </Button>
        </Card>
      </Row>
      <div style={{ margin: '24px 0' }} />
      <Table columns={columns} dataSource={data} />
      <Modal
        title={`Удалить ${deletedOrder.firstName} ${deletedOrder.lastName}?`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
      <div style={{ margin: '24px 0' }} />
      <h5 className="new_trip_subtitles">Отмененные бронирования</h5>
      <Table columns={deletedColumns} dataSource={deleted} />
    </>
  );
};

export default Trip;
