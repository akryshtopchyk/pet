import { Col, Row, Button, Table, Input, Card, Modal, Select } from 'antd';
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`${import.meta.env.VITE_ROUTE}order/${id}`);
      if (data.status === 200) {
        const orderData = data.data.orderData;
        setData(
          orderData.map((el) => ({
            key: el._id,
            firstName: el.firstName,
            lastName: el.lastName,
            phoneNumber: el.phoneNumber,
            count: el.seatCount,
            description: el.description,
            fromStop: el.fromStop,
            toStop: el.toStop,
          })),
        );
      } else {
        setData([]);
      }
      const trip = await axios.get(`${import.meta.env.VITE_ROUTE}trip/${id}`);
      if (trip.status === 200) {
        const tripData = trip.data.existingTrip;
        setTrip({
          id: tripData._id,
          date: tripData.date,
          from: tripData.from,
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
          orderData.map((el) => ({
            key: el._id,
            firstName: el.firstName,
            lastName: el.lastName,
            phoneNumber: el.phoneNumber,
            count: el.seatCount,
            description: el.description,
            fromStop: el.fromStop,
            toStop: el.toStop,
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

  const columns = [
    {
      title: '??????',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: '??????????????',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: '?????????? ????????????????',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '???????????????????? ????????',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '??????????????',
      dataIndex: 'fromStop',
      key: 'fromStop',
    },
    {
      title: '??????????????',
      dataIndex: 'toStop',
      key: 'toStop',
    },
    {
      title: '??????????????',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '????????????????',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.key)}>
          ??????????????
        </Button>
      ),
    },
  ];

  const showNewPassenger = () => {
    setIsNewPassenger(!isNewPassenger);
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
      const fromStopV =
        trip.from === 'minsk'
          ? stops.mi.find((stop) => stop.id === fromStop)
          : stops.im.find((stop) => stop.id === fromStop);
      const toStopV =
        trip.from === 'minsk'
          ? stops.im.find((stop) => stop.id === toStop)
          : stops.mi.find((stop) => stop.id === toStop);
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
            orderData.map((el) => ({
              key: el._id,
              firstName: el.firstName,
              lastName: el.lastName,
              phoneNumber: el.phoneNumber,
              count: el.seatCount,
              description: el.description,
              fromStop: el.fromStop,
              toStop: el.toStop,
            })),
          );
        } else {
          setData([]);
        }
      }
      setIsNewPassenger(!isNewPassenger);
    }
  };
  if (load) {
    return '????????????????';
  }
  return (
    <>
      <Row>
        <Col span={2}>
          <Link style={{ fontSize: 24 }} to="/trips">
            ??????????
          </Link>
        </Col>
        <Col style={{ fontSize: 24 }} span={6}>
          {trip.from === 'minsk' ? '?????????? - ??????????????' : '?????????????? - ??????????'}
        </Col>
        <Col style={{ fontSize: 24 }} span={4}>
          {`${new Date(trip.date).getDate()}.${
            new Date(trip.date).getMonth() + 1
          }.${new Date(trip.date).getFullYear()} ${trip.departureTime}`}
        </Col>
        <Col style={{ fontSize: 24 }} span={4}>
          ?????????? ??????????: {trip.seatCount}
        </Col>
        <Col style={{ fontSize: 24 }} span={4}>
          ????????????????: {trip.seatCount - trip.orders}
        </Col>
        <Col style={{ fontSize: 24 }} span={4}>
          ???????? ??????????????: {trip.sum}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <h3>????????????????</h3>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Button type="primary" onClick={showNewPassenger}>
            ???????????????? ??????????????????
          </Button>
        </Col>
      </Row>
      <div style={{ margin: '24px 0' }} />
      <Row style={{ display: isNewPassenger ? 'block' : 'none' }}>
        <Card title="?????????? ??????????????" style={{ width: '100%' }}>
          <TextArea
            placeholder="??????"
            autoSize
            value={firstName}
            onChange={changeFirstName}
          />
          <div style={{ margin: '24px 0' }} />
          <TextArea
            placeholder="??????????????"
            autoSize
            value={lastName}
            onChange={changeLastName}
          />
          <div style={{ margin: '24px 0' }} />
          <TextArea
            placeholder="?????????? ????????????????"
            autoSize
            value={phoneNumber}
            onChange={changePhoneNumber}
          />
          <div style={{ margin: '24px 0' }} />
          <TextArea
            placeholder="???????????????????? ????????"
            autoSize
            value={count}
            onChange={changeCount}
          />
          <div style={{ margin: '24px 0' }} />
          {/* <TextArea placeholder="??????????????" autoSize value={fromStop} onChange={changeFromStop} />
          <div style={{ margin: '24px 0' }} />
          <TextArea placeholder="??????????????" autoSize value={toStop} onChange={changeToStop} />
          <div style={{ margin: '24px 0' }} /> */}

          <h4 className="new_trip_subtitles">??????????????</h4>
          <Select
            style={{ width: '100%' }}
            onChange={changeFromStop}
            options={
              trip.from === 'minsk'
                ? stops.mi.map((stop) => ({ value: stop.id, label: stop.name }))
                : stops.im.map((stop) => ({ value: stop.id, label: stop.name }))
            }
          />
          <h4 className="new_trip_subtitles">??????????????</h4>
          <Select
            style={{ width: '100%' }}
            onChange={changeToStop}
            options={
              trip.from === 'minsk'
                ? stops.im.map((stop) => ({ value: stop.id, label: stop.name }))
                : stops.mi.map((stop) => ({ value: stop.id, label: stop.name }))
            }
          />
          <div style={{ margin: '24px 0' }} />
          <TextArea
            placeholder="??????????????"
            autoSize
            value={description}
            onChange={changeDescription}
          />
          <div style={{ margin: '24px 0' }} />
          <Button type="primary" onClick={createPassenger}>
            ????????????????
          </Button>
        </Card>
      </Row>
      <div style={{ margin: '24px 0' }} />
      <Table columns={columns} dataSource={data} />
      <Modal
        title={`?????????????? ${deletedOrder.firstName} ${deletedOrder.lastName}?`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
    </>
  );
};

export default Trip;
