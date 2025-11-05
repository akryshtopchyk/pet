import { Row, Button, Table, Input } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const SearchIndex = () => {
  const [searchData, setSearchData] = useState('');
  const [orderData, setOrderData] = useState([]);
  const handleSearch = async () => {
    if (searchData.length > 0) {
      const res = await axios.get(
        `${import.meta.env.VITE_ROUTE}trip/search/${searchData}`,
      );
      if (res?.data?.orderData?.length) {
        setOrderData(res?.data?.orderData);
      } else {
        alert('Ничего не найдено');
      }
    } else {
      alert('Ничего не найдено');
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
      title: 'Поездка',
      render: (_, record) => <p>{getTripTitle(record.from, record.to)}</p>,
      key: 'tripTitle',
    },
    {
      title: 'Дата',
      render: (_, record) => (
        <p>{new Date(record.date).toLocaleDateString()}</p>
      ),
      key: 'date',
    },
    {
      title: 'Время',
      dataIndex: 'departureTime',
      key: 'departureTime',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Row>
          <Link to={`/trips/${record.tripId}`}>К поездке</Link>
        </Row>
      ),
    },
  ];
  return (
    <>
      <Row style={{ margin: '12px' }}>
        <h3 style={{ margin: '0' }}>Данные</h3>
        <Input
          style={{ margin: '12px 0' }}
          value={searchData}
          onChange={(e) => {
            setSearchData(e.target.value);
          }}
        ></Input>
        <Button type="primary" onClick={() => handleSearch()}>
          Поиск
        </Button>
      </Row>
      <Table columns={columns} dataSource={orderData} />
    </>
  );
};

export default SearchIndex;
