import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  async createNews(@Res() response, @Body() createNewsDto: CreateNewsDto) {
    try {
      const newNews = await this.newsService.create(createNewsDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'News has been created successfully',
        newNews,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: News not created!',
        error: 'Bad Request',
      });
    }
  }

  @Put('/:id')
  async updateNews(
    @Res() response,
    @Param('id') newsId: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    try {
      const existingNews = await this.newsService.update(newsId, updateNewsDto);
      return response.status(HttpStatus.OK).json({
        message: 'News has been successfully updated',
        existingNews,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  async getNews(@Res() response) {
    try {
      const newsData = await this.newsService.getAll();
      return response.status(HttpStatus.OK).json({
        message: 'All news data found successfully',
        newsData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getNewsById(@Res() response, @Param('id') newsId: string) {
    try {
      const existingNews = await this.newsService.getById(newsId);
      return response.status(HttpStatus.OK).json({
        message: 'News found successfully',
        existingNews,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deleteNews(@Res() response, @Param('id') newsId: string) {
    try {
      const deletedNews = await this.newsService.delete(newsId);
      return response.status(HttpStatus.OK).json({
        message: 'News deleted successfully',
        deletedNews,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
