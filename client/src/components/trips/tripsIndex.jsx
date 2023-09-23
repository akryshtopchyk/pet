import {
  Col,
  Row,
  Button,
  Table,
  Modal,
  Card,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';

const TripsIndex = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedTrip, setDeletedTrip] = useState({});
  const [isNewTrip, setIsNewTrip] = useState(false);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [date, setDate] = useState(new Date());
  const [departureTime, setDepartureTime] = useState('');
  const [seatCount, setSeatCount] = useState(15);
  const [sum, setSum] = useState(25);
  const [data, setData] = useState([]);
  const [grodnoData, setGrodnoData] = useState([]);
  const [history, setHistory] = useState([]);

  const onChangeDate = (date, dateString) => {
    setDate(new Date(dateString));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`${import.meta.env.VITE_ROUTE}trip`);
      if (data.status === 200) {
        const tripData = data.data.tripData;
        setAllData(tripData);
      }
      const historyData = await axios.get(
        `${import.meta.env.VITE_ROUTE}trip/history`,
      );
      if (historyData.status === 200) {
        const tripData = historyData.data.tripData;
        setHistory(
          tripData.map((el) => ({
            key: el._id,
            tripTitle: getTripTitle(el.from, el.to),
            date: `${new Date(el.date).getDate()}.${
              new Date(el.date).getMonth() + 1
            }.${new Date(el.date).getFullYear()}`,
            dateTime: el.departureTime,
            place: el.seatCount,
            freePlace: el.seatCount - el.orders,
            cost: el.sum,
          })),
        );
      }
    };
    fetchData().catch(console.error);
  }, []);

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

  const getDay = (day) => {
    switch (day) {
      case 0:
        return 'воскресенье';
      case 1:
        return 'понедельник';
      case 2:
        return 'вторник';
      case 3:
        return 'среда';
      case 4:
        return 'четверг';
      case 5:
        return 'пятница';
      case 6:
        return 'суббота';
    }
  };

  const createTrip = async () => {
    const regEx = /[0-2]\d:[0-5]\d/;
    if (
      from &&
      to &&
      date &&
      departureTime &&
      seatCount &&
      sum &&
      regEx.test(departureTime)
    ) {
      console.log(from, to);
      const res = await axios.post(`${import.meta.env.VITE_ROUTE}trip`, {
        from,
        to,
        date,
        arrivalTime: getArrivalTime(departureTime),
        departureTime,
        seatCount,
        sum,
      });
      if (res.status === 201) {
        const data = await axios.get(`${import.meta.env.VITE_ROUTE}trip`);
        const tripData = data.data.tripData;
        setAllData(tripData);
      }
      setIsNewTrip(!isNewTrip);
    } else {
      alert('Проверьте Время отправления');
    }
  };

  const getArrivalTime = (dTime) => {
    console.log(to, from);
    if (to === 'minsk' || from === 'minsk') {
      const startH = +dTime.split(':')[0] * 60;
      const startM = +dTime.split(':')[1];
      const resultH = Math.trunc((startH + startM + 200) / 60);
      const resultM = startH + startM + 200 - resultH * 60;
      return `${resultH < 10 ? '0' + resultH : resultH}:${
        resultM < 10 ? '0' + resultM : resultM
      }`;
    } else {
      const startH = +dTime.split(':')[0] * 60;
      const startM = +dTime.split(':')[1];
      const resultH = Math.trunc((startH + startM + 240) / 60);
      const resultM = startH + startM + 240 - resultH * 60;
      return `${resultH < 10 ? '0' + resultH : resultH}:${
        resultM < 10 ? '0' + resultM : resultM
      }`;
    }
  };

  const handleChangeFrom = (value) => {
    setFrom(value);
  };
  const handleChangeTo = (value) => {
    console.log(value);
    setTo(value);
  };

  const showNewTrip = () => {
    setIsNewTrip(!isNewTrip);
  };

  const handleDelete = (key) => {
    const trip = data.find((el) => el.key === key);
    if (trip) {
      setDeletedTrip(trip);
      setIsModalOpen(true);
    } else {
      setDeletedTrip(grodnoData.find((el) => el.key === key));
      setIsModalOpen(true);
    }
  };

  const handleOk = async () => {
    const res = await axios.delete(
      `${import.meta.env.VITE_ROUTE}trip/${deletedTrip.key}`,
    );
    if (res.status === 200) {
      const data = await axios.get(`${import.meta.env.VITE_ROUTE}trip`);
      if (data.status === 200) {
        const tripData = data.data.tripData;
        setAllData(tripData);
      }
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const setAllData = (tripData) => {
    const minsk = [];
    const grodno = [];
    tripData.forEach((el) => {
      if (el.from === 'minsk' || el.to === 'minsk') {
        minsk.push({
          key: el._id,
          tripTitle: getTripTitle(el.from, el.to),
          date: `${new Date(el.date).getDate()}.${
            new Date(el.date).getMonth() + 1
          }.${new Date(el.date).getFullYear()} - ${getDay(
            new Date(el.date).getDay(),
          )}`,
          dateTime: el.departureTime,
          place: el.seatCount,
          freePlace: el.seatCount - el.orders,
          cost: el.sum,
        });
      }
      if (el.from === 'grodno' || el.to === 'grodno') {
        grodno.push({
          key: el._id,
          tripTitle: getTripTitle(el.from, el.to),
          date: `${new Date(el.date).getDate()}.${
            new Date(el.date).getMonth() + 1
          }.${new Date(el.date).getFullYear()} - ${getDay(
            new Date(el.date).getDay(),
          )}`,
          dateTime: el.departureTime,
          place: el.seatCount,
          freePlace: el.seatCount - el.orders,
          cost: el.sum,
        });
      }
    });

    setData(minsk);
    setGrodnoData(grodno);
  };

  const columns = [
    {
      title: 'Поездка',
      dataIndex: 'tripTitle',
      key: 'tripTitle',
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Время',
      dataIndex: 'dateTime',
      key: 'dateTime',
    },
    {
      title: 'Количество мест всего',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: 'Количество мест осталось',
      dataIndex: 'freePlace',
      key: 'freePlace',
    },
    {
      title: 'Цена',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <div>
          <Link to={`/trips/${record.key}`}>Подробнее</Link>
          <Button
            type="primary"
            danger
            style={{ marginLeft: 16 }}
            onClick={() => handleDelete(record.key)}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ];
  const historyColumns = [
    {
      title: 'Поездка',
      dataIndex: 'tripTitle',
      key: 'tripTitle',
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Время',
      dataIndex: 'dateTime',
      key: 'dateTime',
    },
    {
      title: 'Количество мест всего',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: 'Количество мест осталось',
      dataIndex: 'freePlace',
      key: 'freePlace',
    },
    {
      title: 'Цена',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <div>
          <Link to={`/trips/${record.key}`}>Подробнее</Link>
        </div>
      ),
    },
  ];

  const handleDepartureTime = (value) => {
    setDepartureTime(value.target.value);
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <h1>Поездки</h1>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Button type="primary" onClick={showNewTrip}>
            Новая поездка
          </Button>
        </Col>
      </Row>
      <div style={{ margin: '24px 0' }} />
      <Row style={{ display: isNewTrip ? 'block' : 'none' }}>
        <Card title="Новый поездка" style={{ width: '100%' }}>
          <Row>
            <Col span={6}>
              <h4 className="new_trip_subtitles">Из</h4>
              <Select
                style={{ width: 132 }}
                onChange={handleChangeFrom}
                options={[
                  { value: 'minsk', label: 'Минск' },
                  { value: 'ivanovo', label: 'Иваново' },
                  { value: 'grodno', label: 'Гродно' },
                ]}
              />
            </Col>
            <Col span={6}>
              <h4 className="new_trip_subtitles">В</h4>
              <Select
                style={{ width: 132 }}
                onChange={handleChangeTo}
                options={[
                  { value: 'minsk', label: 'Минск' },
                  { value: 'ivanovo', label: 'Иваново' },
                  { value: 'grodno', label: 'Гродно' },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <h4 className="new_trip_subtitles">Дата</h4>
              <DatePicker onChange={onChangeDate} />
            </Col>
            <Col span={6}>
              <h4 className="new_trip_subtitles">Время отправления</h4>
              <Input
                onChange={handleDepartureTime}
                value={departureTime}
                placeholder="Время отправления"
                style={{ width: 132 }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <h4 className="new_trip_subtitles">Количество мест</h4>
              <InputNumber
                onChange={setSeatCount}
                value={seatCount}
                placeholder="Количество мест"
                type="number"
                style={{ width: 132 }}
              />
            </Col>
            <Col span={6}>
              <h4 className="new_trip_subtitles">Цена</h4>
              <InputNumber
                onChange={setSum}
                value={sum}
                placeholder="Цена"
                type="number"
                style={{ width: 132 }}
              />
            </Col>
          </Row>
          <div style={{ margin: '8px 0' }} />
          <Button type="primary" onClick={createTrip}>
            Добавить
          </Button>
        </Card>
      </Row>
      <div style={{ margin: '24px 0' }} />
      <Row>
        <Col span={24}>
          <h1>Иваново-Минск-Иваново</h1>
        </Col>
      </Row>
      <Table columns={columns} dataSource={data} />

      <div style={{ margin: '24px 0' }} />
      <Row>
        <Col span={24}>
          <h1>Иваново-Гродно-Иваново</h1>
        </Col>
      </Row>
      <Table columns={columns} dataSource={grodnoData} />

      <Row>
        <Col span={24}>
          <h1>Прошедшые маршруты</h1>
        </Col>
      </Row>

      <Table columns={historyColumns} dataSource={history} />
      <Outlet />
      <Modal
        title={`Удалить поездку ${deletedTrip.tripTitle}?`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
    </>
  );
};

export default TripsIndex;
