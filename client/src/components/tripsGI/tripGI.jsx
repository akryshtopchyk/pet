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

const TripGI = () => {
  const [isNewPassenger, setIsNewPassenger] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletedOrder, setDeletedOrder] = useState({});
  const [loadText, setLoadText] = useState('загрузка');

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
  const [newSum, setNewSum] = useState(0);
  const [newCar, setNewCar] = useState('');
  const [newDriver, setNewDriver] = useState('');

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
              isApproved: el.isApproved,
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
              isApproved: el.isApproved,
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
          car: tripData.car,
          driver: tripData.driver,
        });
        setNewCar(tripData.car);
        setNewPlaceCount(tripData.seatCount);
        setNewSum(tripData.sum);
        setNewDriver(tripData.driver);
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
    fetchData().catch(() => {
      setLoadText('Поездка не найдена');
    });
  }, []);

  const changeNewPlaceCount = (value) => {
    setNewPlaceCount(value);
  };
  const changeSum = (value) => {
    setNewSum(value);
  };
  const changeNewCar = (value) => {
    setNewCar(value.target.value);
  };
  const changeNewDriver = (value) => {
    setNewDriver(value.target.value);
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
    setIsDeleteModalOpen(true);
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
              isApproved: el.isApproved,
            };
          }),
        );
      } else {
        setData([]);
      }
    }
    setIsDeleteModalOpen(false);
  };

  const handleApprove = async (orderId, isApproved) => {
    setLoadText(true);
    const res = await axios.put(
      `${import.meta.env.VITE_ROUTE}order/${orderId}`,
      {
        isApproved,
      },
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
              isApproved: el.isApproved,
            };
          }),
        );
      } else {
        setData([]);
      }
    }
    setLoadText(false);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
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
      title: 'Потвержден?',
      render: (_, record) =>
        record.isApproved ? (
          <Button
            type="primary"
            onClick={() => handleApprove(record.key, false)}
            danger
          >
            Отменить подтверждение
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => handleApprove(record.key, true)}
          >
            Подтвердить
          </Button>
        ),
      key: 'isApproved',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(record.key)}
          >
            Удалить
          </Button>
          <div style={{ margin: '8px 0' }} />
          <Link to={`/users/${record.phoneNumber}`}>Подробнее</Link>
        </>
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
    {
      title: 'Потвержден?',
      render: (_, record) => <p>{record.isApproved === true ? 'да' : 'нет'}</p>,
      key: 'isApproved',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Link to={`/users/${record.phoneNumber}`}>Подробнее</Link>
      ),
    },
  ];

  const showNewPassenger = () => {
    setIsNewPassenger(!isNewPassenger);
  };

  const updateTrip = async () => {
    await axios.put(`${import.meta.env.VITE_ROUTE}trip/${id}`, {
      seatCount: newPlaceCount,
      sum: newSum,
      car: newCar,
      driver: newDriver,
    });
    const trip = await axios.get(`${import.meta.env.VITE_ROUTE}trip/${id}`);
    if (trip.status === 200) {
      const tripData = trip.data.existingTrip;
      setNewPlaceCount(tripData.seatCount);
      setNewSum(tripData.sum);
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
        car: tripData.car,
        driver: tripData.driver,
      });
    } else {
      setTrip({});
    }
  };

  const getFromStops = (from, to) => {
    console.log(from, to);
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

    if (from === 'moskva' && to === 'pinsk') {
      return stops.fromMoskvaToPinsk;
    }
    if (from === 'pinsk' && to === 'moskva') {
      return stops.fromPinskToMoskva;
    }
  };
  const getToStops = (from, to) => {
    console.log(from, to);
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
    if (from === 'moskva' && to === 'pinsk') {
      return stops.toPinskFromMoskva;
    }
    if (from === 'pinsk' && to === 'moskva') {
      return stops.toMoskvaFromPinsk;
    }
  };

  const createPassenger = async () => {
    if (firstName && lastName && phoneNumber && count && fromStop && toStop) {
      const fromStops = getFromStops(trip.from, trip.to);
      const fromStopV = fromStops.find((stop) => stop.id === fromStop);
      const toStops = getToStops(trip.from, trip.to);
      const toStopV = toStops.find((stop) => stop.id === toStop);
      const res = await axios.post(`${import.meta.env.VITE_ROUTE}order`, {
        firstName,
        lastName,
        phoneNumber,
        description: description || '.',
        tripId: id,
        fromStop: fromStopV.name,
        fromStopTime: fromStopV.time.toString(),
        toStop: toStopV.name,
        toStopTime: toStopV.time.toString(),
        seatCount: +count,
        isApproved: false,
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
                isApproved: el.isApproved,
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
      case 'moskva':
        newFrom = 'Москва';
        break;
      case 'pinsk':
        newFrom = 'Пинск';
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
      case 'moskva':
        newTo = 'Москва';
        break;
      case 'pinsk':
        newTo = 'Пинск';
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
    if (from === 'moskva' && to === 'pinsk') {
      return stops.fromMoskvaToPinsk.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
    if (from === 'pinsk' && to === 'moskva') {
      return stops.fromPinskToMoskva.map((stop) => ({
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
    if (from === 'moskva' && to === 'pinsk') {
      return stops.toPinskFromMoskva.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
    if (from === 'pinsk' && to === 'moskva') {
      return stops.toMoskvaFromPinsk.map((stop) => ({
        value: stop.id,
        label: stop.name,
      }));
    }
  };

  if (load) {
    return (
      <div>
        <h1>{loadText}</h1>
      </div>
    );
  }
  return (
    <>
      <Row>
        <Col span={2}>
          <Link style={{ fontSize: 24 }} to="/trips">
            Назад
          </Link>
        </Col>
      </Row>
      <Row>
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
        <Col style={{ fontSize: 24 }} span={12}>
          машина: {trip.car}
        </Col>
        <Col style={{ fontSize: 24 }} span={12}>
          водитель: {trip.driver}
        </Col>
      </Row>
      <Row style={{ marginBottom: '16px' }}>
        <Card title="Обновление" style={{ width: '500px' }}>
          <Row>
            <Col span={12}>
              <h4 className="new_trip_subtitles">Новое кол-во мест</h4>
              <InputNumber
                onChange={changeNewPlaceCount}
                value={newPlaceCount}
                placeholder="Новое кол-во мест"
                type="number"
                style={{ width: 132 }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <h4 className="new_trip_subtitles">Новая цена</h4>
              <InputNumber
                onChange={changeSum}
                value={newSum}
                placeholder="Новая цена"
                type="number"
                style={{ width: 132 }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <h4 className="new_trip_subtitles">Новая машина</h4>
              <Input
                onChange={changeNewCar}
                value={newCar}
                placeholder="Новая машина"
                style={{ width: 424 }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <h4 className="new_trip_subtitles">Новый Водитель</h4>
              <Input
                onChange={changeNewDriver}
                value={newDriver}
                placeholder="Новый Водитель"
                style={{ width: 424 }}
              />
            </Col>
          </Row>
          <div style={{ margin: '8px 0' }} />
          <Button
            type="primary"
            onClick={updateTrip}
            style={{ marginLeft: '12px' }}
          >
            Обновить
          </Button>
        </Card>
      </Row>
      <Row>
        <Col span={24}>
          <h3>Пасажиры</h3>
        </Col>
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
        open={isDeleteModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
      <div style={{ margin: '24px 0' }} />
      <h3>Отмененные бронирования</h3>
      <Table columns={deletedColumns} dataSource={deleted} />
    </>
  );
};

export default TripGI;
