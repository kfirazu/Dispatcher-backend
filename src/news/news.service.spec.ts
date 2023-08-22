import { Test, TestingModule } from '@nestjs/testing'
import { NewsService } from './news.service'
import { NewsRepository } from './news.repository'
import { ArticleDocument } from './article.schema'

describe('NewsService', () => {
  let service: NewsService
  let fakeNewsRepository: Partial<NewsRepository>

  beforeEach(async () => {

    fakeNewsRepository = {
      getAllData: async () => Promise.resolve([]),
      getFilteredArticles: async (query: any, searchQuery?: string, page?: number) => Promise.resolve([]),
      saveArticlesToDb: async (articlesData: ArticleDocument[]) => Promise.resolve([]),
      onModuleInit: () => { }

    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: NewsRepository,
          useValue: fakeNewsRepository
        }
      ],

    }).compile()

    service = module.get<NewsService>(NewsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // buildApiRequestQuery
  it('Should build api request query string', () => {
    const initialFilterBy = {
      type: 'top-headlines',
      source: '',
      category: '',
      country: 'il',
      language: '',
      sortBy: '',
      //   from?: Date
      // to?: Date
    }
    const queryStr = service.buildApiRequestQuery(initialFilterBy, '', 1)
    expect(queryStr).toBe('https://newsapi.org/v2/top-headlines?country=il&page=1')
  })
  it('Should return undefined', () => {
    const FilterBy = {
      type: '',
      source: '',
      category: '',
      country: '',
      language: '',
      sortBy: '',
      //   from?: Date
      // to?: Date
    }
    const queryStr = service.buildApiRequestQuery(FilterBy, '', 1)
    expect(queryStr).toBe(undefined)
  })
  it('Should build api request query string with searchQeury', () => {
    const FilterBy = {
      type: 'top-headlines',
      source: '',
      category: 'sports',
      country: 'us',
      language: '',
      sortBy: '',
      //   from?: Date
      // to?: Date
    }
    const queryStr = service.buildApiRequestQuery(FilterBy, 'messi', 2)
    expect(queryStr).toBe('https://newsapi.org/v2/top-headlines?country=us&category=sports&q=messi&page=2')
  })
  it('Should build api request query string with searchQeury', () => {
    const FilterBy = {
      type: 'everything',
      source: 'cnn',
      category: '',
      country: '',
      language: '',
      sortBy: '',
      //   from?: Date
      // to?: Date
    }
    const queryStr = service.buildApiRequestQuery(FilterBy, undefined, 2)
    expect(queryStr).toBe('https://newsapi.org/v2/everything?sources=cnn&page=2')
  })

  /////////////////////////////////////////////////////////////////////////////////////////////////


})
