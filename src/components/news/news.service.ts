import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { INews } from '../../interfaces/news.interface';

@Injectable()
export class NewsService {
  constructor(@InjectModel('News') private newsModel: Model<INews>) {}

  async create(createNewsDto: CreateNewsDto): Promise<INews> {
    const newNews = await new this.newsModel(createNewsDto);
    return newNews.save();
  }

  async update(newsId: string, updateNewsDto: UpdateNewsDto): Promise<INews> {
    const existingNews = await this.newsModel.findByIdAndUpdate(
      newsId,
      updateNewsDto,
      { new: true },
    );
    if (!existingNews) {
      throw new NotFoundException(`News #${newsId} not found`);
    }
    return existingNews;
  }

  async getAll(): Promise<INews[]> {
    const newsData = await this.newsModel.find({ date: { $gte: new Date() } });
    if (!newsData || newsData.length == 0) {
      return [];
    }
    return newsData;
  }

  async getById(newsId: string): Promise<INews> {
    const existingNews = await this.newsModel.findById(newsId).exec();
    if (!existingNews) {
      throw new NotFoundException(`News #${newsId} not found`);
    }
    return existingNews;
  }

  async delete(newsId: string): Promise<INews> {
    const deletedNews = await this.newsModel.findByIdAndDelete(newsId);
    if (!deletedNews) {
      throw new NotFoundException(`News #${newsId} not found`);
    }
    return deletedNews;
  }
}
