import { Col, Row, Card, Space, Button, Input, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
const { TextArea } = Input;

const NewsIndex = () => {
  const [isNewsItem, setIsNewsItem] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedNews, setDeletedNews] = useState({});
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`${import.meta.env.VITE_ROUTE}news`);
      if (data.status === 200) {
        const newsData = data.data.newsData;
        setNews(
          newsData.map((el) => ({
            id: el._id,
            title: el.title,
            text: el.text,
          })),
        );
      } else {
        setNews([]);
      }
    };
    fetchData().catch(console.error);
  }, []);

  const handleDelete = (id) => {
    setDeletedNews(news.find((el) => el.id === id));
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const res = await axios.delete(
      `${import.meta.env.VITE_ROUTE}news/${deletedNews.id}`,
    );
    if (res.status === 200) {
      const data = await axios.get(`${import.meta.env.VITE_ROUTE}news`);
      const newsData = data.data.newsData;
      setNews(
        newsData.map((el) => ({
          id: el._id,
          title: el.title,
          text: el.text,
        })),
      );
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showNewNewsItem = () => {
    setIsNewsItem(!isNewsItem);
  };

  const addNewNews = async () => {
    if (text && title) {
      const res = await axios.post(`${import.meta.env.VITE_ROUTE}news`, {
        text,
        title,
        createdAt: new Date(),
      });
      if (res.status === 201) {
        const data = await axios.get(`${import.meta.env.VITE_ROUTE}news`);
        const newsData = data.data.newsData;
        setNews(
          newsData.map((el) => ({
            id: el._id,
            title: el.title,
            text: el.text,
          })),
        );
      }
      setIsNewsItem(!isNewsItem);
    }
  };

  const changeTitle = (value) => {
    setTitle(value.target.value);
  };

  const changeText = (value) => {
    setText(value.target.value);
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <h1>Новости</h1>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Button type="primary" onClick={showNewNewsItem}>
            Добавить
          </Button>
        </Col>
      </Row>
      <div style={{ margin: '24px 0' }} />
      <Row style={{ display: isNewsItem ? 'block' : 'none' }}>
        <Card title="Новая новость" style={{ width: '100%' }}>
          <TextArea
            placeholder="Заголовок"
            autoSize
            value={title}
            onChange={changeTitle}
          />
          <div style={{ margin: '24px 0' }} />
          <TextArea
            placeholder="Текст"
            autoSize
            value={text}
            onChange={changeText}
          />
          <div style={{ margin: '24px 0' }} />
          <Button type="primary" onClick={addNewNews}>
            Добавить
          </Button>
        </Card>
      </Row>
      <div style={{ margin: '24px 0' }} />
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {news.map((el) => (
          <Row key={el.id}>
            <Col span={24}>
              <Card title={el.title}>
                <div>{el.text}</div>
                <Button
                  style={{ marginTop: 16 }}
                  type="primary"
                  danger
                  onClick={() => handleDelete(el.id)}
                >
                  Удалить
                </Button>
              </Card>
            </Col>
          </Row>
        ))}
      </Space>

      <Modal
        title={`Удалить ${deletedNews.title}?`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
      <Outlet />
    </>
  );
};

export default NewsIndex;
