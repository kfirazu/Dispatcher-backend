import { Test, TestingModule } from '@nestjs/testing'
import { NewsController } from './news.controller'
import { FilterOptions } from '../models/filter-options.interface'
import { Article, ArticleDocument, ArticleSchema } from './article.schema'
import { NewsRepository } from './news.repository'
import { Model } from 'mongoose'
import { FilterBy } from 'src/models/filter-by.interface'
import { NewsService } from './news.service'

describe('NewsController', () => {
  let newsController: NewsController
  let fakeNewsService: Partial<NewsService>
  let fakeNewsRepository: Partial<NewsRepository>
  let articleModel: Model<ArticleDocument>

  beforeEach(async () => {
    fakeNewsRepository = {
      getAllData: async () => Promise.resolve([]),
      getFilteredArticles: async (query: any, searchQuery?: string, page?: number) => Promise.resolve([]),
      saveArticlesToDb: async (articlesData: ArticleDocument[]) => Promise.resolve([]),
      onModuleInit: () => { }

    }

    fakeNewsService = {
      getAllDataFromDb: async () => Promise.resolve([]),
      // buildDbQueryFromFilter: (filterBy: FilterBy, searchQuery: string) => [],
      buildApiRequestQuery: (filterBy: FilterBy, searchQuery: string, page: number) => '',
      getNextParameter: (searchIn: FilterOptions) => {
        return { name: '', value: '' }
      },
      // fetchEvery15Minutes: () => void

    }

    // const articles: Article[] = []
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        // NewsService,
        {
          provide: NewsRepository,
          useValue: fakeNewsRepository
        },
        {
          provide: NewsService,
          useValue: fakeNewsService
        }

      ]
    }).compile()

    newsController = module.get<NewsController>(NewsController)
  })

  it('Should be defined', () => {
    expect(newsController).toBeDefined()
  })

  it('should return an array of all articles in db', async () => {
    const articles = await newsController.getAllData()
    expect(Array.isArray(articles)).toBe(true);
    // expect(articles).toBeGreaterThan(100)

  })

})

// it('findAllUsers returns a list of users with the given email', async () => {
//   const users = await controller.findAllUsers('asdf@asdf.com');
//   expect(users.length).toEqual(1);
//   expect(users[0].email).toEqual('asdf@asdf.com');
// });
