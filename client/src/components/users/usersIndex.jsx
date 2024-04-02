import { Table, Button, Modal, Input, Checkbox, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const UsersIndex = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedUser, setDeletedUser] = useState({});
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isBlock, setIsBlock] = useState(false);
  const [searchPhoneNumber, setSearchPhoneNumber] = useState('');
  const [searchName, setSearchName] = useState('');

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
        const elements = passengerData.map((el) => ({
          key: el._id,
          firstName: el.firstName,
          lastName: el.lastName,
          phoneNumber: el.phoneNumber,
          isBlock: el.isBlock,
        }));
        setData(elements);
        setFilteredData(elements);
      } else {
        setData([]);
        setFilteredData([]);
      }
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let res = data;
    if (isBlock) {
      res = res.filter((el) => el.isBlock === true);
    }
    if (searchName.length) {
      res = res.filter(
        (el) =>
          el.lastName.includes(searchName) || el.firstName.includes(searchName),
      );
    }
    if (searchPhoneNumber.length) {
      res = res.filter((el) => el.phoneNumber.includes(searchPhoneNumber));
    }
    setFilteredData(res);
  }, [isBlock, searchName, searchPhoneNumber]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`${import.meta.env.VITE_ROUTE}passenger`);
      if (data.status === 200) {
        const passengerData = data.data.passengerData;
        const elements = passengerData.map((el) => ({
          key: el._id,
          firstName: el.firstName,
          lastName: el.lastName,
          phoneNumber: el.phoneNumber,
          isBlock: el.isBlock,
        }));
        setData(elements);
        setFilteredData(elements);
      } else {
        setData([]);
        setFilteredData([]);
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
        <Row>
          <Link to={`/users/${record.phoneNumber}`}>Подробнее</Link>
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(record.key)}
          >
            Удалить
          </Button>
        </Row>
      ),
    },
  ];

  const rowClassName = (record) => {
    return record.isBlock === true ? 'deleted' : '';
  };

  return (
    <>
      <Row>
        <Checkbox
          checked={isBlock}
          onChange={(e) => {
            setIsBlock(e.target.checked);
          }}
        >
          Заблокирован?
        </Checkbox>
      </Row>
      <Row>
        <h3>Номер телефона</h3>
        <Input
          value={searchPhoneNumber}
          onChange={(e) => {
            setSearchPhoneNumber(e.target.value);
          }}
        ></Input>
      </Row>
      <Row>
        <h3>Имя, фамилия</h3>
        <Input
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
          }}
        ></Input>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowClassName={rowClassName}
      />
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
