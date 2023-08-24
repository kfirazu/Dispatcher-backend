import { Test, TestingModule } from '@nestjs/testing'
// import { FilterOptions, NewsService } from './news.service'
import { NewsRepository } from './news.repository'
import { ArticleDocument } from './article.schema'
import { FilterBy } from '../models/filter-by.interface'
import { NewsService } from './news.service'
import { FilterOptions } from '../models/filter-options.interface'


describe('NewsService', () => {
  let service: NewsService
  let fakeNewsRepository: Partial<NewsRepository>

  beforeEach(async () => {

    fakeNewsRepository = {
      getAllData: async () => Promise.resolve([]),
      getFilteredArticles: async (query: any, searchQuery?: string, page?: number) => Promise.resolve([
        {
          _id: " 64e352eef33a633f13e95052",
          type: "top-headlines",
          source: {
            id: "the-washington-post",
            name: "The Washington Post",
            _id: "64e352eef33a633f13e9503d"
          },
          author: " Debby Waldman",
          title: "Acknowledging suicide as cause of death no longer taboo in obituaries - The Washington Post",
          description: "The reluctance to talk about suicide has many implications. Stigma also affects everything from how people grieve to how people help prevent it.",
          url: "https://www.washingtonpost.com/wellness/2023/08/20/suicide-obituary-grief-transparency/",
          urlToImage: "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/7KCW3JL73QKL6XZ5VX3VUNWXBU.jpg&w=1440",
          publishedAt: "2023-08-20T12:38:11.000Z",
          content: "Comment on this story\r\nComment\r\nWhen Deborah and Warren Blums 16-year-old died by suicide in November 2021, they went into shock. For two days, the grief-stricken Los Angeles couple didnt sleep.\r\nBut… [+6425 chars]",
          tags: [
            "us"
          ],
          __v: 0,
          createdAt: "2023-08-21T12:05:02.650Z",
          updatedAt: "2023-08-21T12:05:02.650Z"
        },
        {
          _id: "64e352eef33a633f13e95053",
          type: "top-headlines",
          source: {
            id: null,
            name: "Yahoo Entertainment",
            _id: "64e352eef33a633f13e9503e"
          },
          author: "MIKE CORDER",
          title: "The Netherlands and Denmark will give F-16 fighter jets to Ukraine, the Dutch prime minister says - Yahoo News",
          description: "The Netherlands and Denmark will give F-16 warplanes to Ukraine as soon as Ukrainian crews and infrastructure are ready for the powerful U.S.-made jets...",
          url: "https://news.yahoo.com/ukraines-zelenskyy-netherlands-us-approved-101925319.html",
          urlToImage: "https://s.yimg.com/ny/api/res/1.2/ODQ58DD12eh0L7TRcSSPiA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD04MDA-/https://media.zenfs.com/en/ap.org/d6bae3e83dd7774bd9d7fc818640faac",
          publishedAt: "2023-08-20T12:27:20.000Z",
          content: " EINDHOVEN, Netherlands (AP) The Netherlands and Denmark will give F-16 warplanes to Ukraine as soon as Ukrainian crews and infrastructure are ready for the powerful U.S.-made jets, Dutch Prime Minist… [+1972 chars]",
          tags: [
            "us"
          ],
          __v: 0,
          createdAt: "2023-08-21T12:05:02.651Z",
          updatedAt: "2023-08-21T12:05:02.651Z"
        },
      ]),
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

  /* ---------------------------------------------------------------------------------------------------------- */

  // buildApiRequestQuery
  describe('buildApiRequestQuery', () => {
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
      const filterBy = {
        type: 'top-headlines',
        source: '',
        category: 'sports',
        country: 'us',
        language: '',
        sortBy: '',
        //   from?: Date
        // to?: Date
      }
      const queryStr = service.buildApiRequestQuery(filterBy, 'messi', 2)
      expect(queryStr).toBe('https://newsapi.org/v2/top-headlines?country=us&category=sports&q=messi&page=2')
    })
    it('Should build api request query string with searchQeury', () => {
      const filterBy = {
        type: 'everything',
        source: 'cnn',
        category: '',
        country: '',
        language: '',
        sortBy: '',
        //   from?: Date
        // to?: Date
      }
      const queryStr = service.buildApiRequestQuery(filterBy, undefined, 2)
      expect(queryStr).toBe('https://newsapi.org/v2/everything?sources=cnn&page=2')
    })
  })

  /* ---------------------------------------------------------------------------------------------------------- */

  //buildDbQueryFromFilter
  describe('buildDbQueryFromFilter', () => {
    it('Should build request query array for db ', () => {
      const filterBy = {
        type: 'everything',
        source: 'cnn',
        category: '',
        country: '',
        language: '',
        sortBy: '',
        //   from?: Date
        // to?: Date
      }
      const query = service.buildDbQueryFromFilter(filterBy, '')
      expect(Array.isArray(query)).toBe(true)
      expect(query).toStrictEqual(["everything", "cnn"])
    })
    it('Should return an empty array ', () => {
      const filterBy = {
        type: '',
        source: '',
        category: '',
        country: '',
        language: '',
        sortBy: '',
        //   from?: Date
        // to?: Date
      }
      const query = service.buildDbQueryFromFilter(filterBy, '')
      expect(Array.isArray(query)).toBe(true)
      expect(query).toStrictEqual([])
    })
  })

  /* ---------------------------------------------------------------------------------------------------------- */
  //getFilteredArticlesFromDb
  describe('getFilteredArticlesFromDb', () => {
    it('should return an array of filtered articles', async () => {
      // Mocked input values
      const filterBy: FilterBy = {
        type: 'top-headlines',
        source: '',
        category: '',
        country: 'us',
        language: '',
        sortBy: '',
      }

      // Mocked articles from the repository
      const mockedArticles = [

        {
          _id: " 64e352eef33a633f13e95052",
          type: "top-headlines",
          source: {
            id: "the-washington-post",
            name: "The Washington Post",
            _id: "64e352eef33a633f13e9503d"
          },
          author: " Debby Waldman",
          title: "Acknowledging suicide as cause of death no longer taboo in obituaries - The Washington Post",
          description: "The reluctance to talk about suicide has many implications. Stigma also affects everything from how people grieve to how people help prevent it.",
          url: "https://www.washingtonpost.com/wellness/2023/08/20/suicide-obituary-grief-transparency/",
          urlToImage: "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/7KCW3JL73QKL6XZ5VX3VUNWXBU.jpg&w=1440",
          publishedAt: "2023-08-20T12:38:11.000Z",
          content: "Comment on this story\r\nComment\r\nWhen Deborah and Warren Blums 16-year-old died by suicide in November 2021, they went into shock. For two days, the grief-stricken Los Angeles couple didnt sleep.\r\nBut… [+6425 chars]",
          tags: [
            "us"
          ],
          __v: 0,
          createdAt: "2023-08-21T12:05:02.650Z",
          updatedAt: "2023-08-21T12:05:02.650Z"
        },
        {
          _id: "64e352eef33a633f13e95053",
          type: "top-headlines",
          source: {
            id: null,
            name: "Yahoo Entertainment",
            _id: "64e352eef33a633f13e9503e"
          },
          author: "MIKE CORDER",
          title: "The Netherlands and Denmark will give F-16 fighter jets to Ukraine, the Dutch prime minister says - Yahoo News",
          description: "The Netherlands and Denmark will give F-16 warplanes to Ukraine as soon as Ukrainian crews and infrastructure are ready for the powerful U.S.-made jets...",
          url: "https://news.yahoo.com/ukraines-zelenskyy-netherlands-us-approved-101925319.html",
          urlToImage: "https://s.yimg.com/ny/api/res/1.2/ODQ58DD12eh0L7TRcSSPiA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD04MDA-/https://media.zenfs.com/en/ap.org/d6bae3e83dd7774bd9d7fc818640faac",
          publishedAt: "2023-08-20T12:27:20.000Z",
          content: " EINDHOVEN, Netherlands (AP) The Netherlands and Denmark will give F-16 warplanes to Ukraine as soon as Ukrainian crews and infrastructure are ready for the powerful U.S.-made jets, Dutch Prime Minist… [+1972 chars]",
          tags: [
            "us"
          ],
          __v: 0,
          createdAt: "2023-08-21T12:05:02.651Z",
          updatedAt: "2023-08-21T12:05:02.651Z"
        },
      ]

      const query = service.buildDbQueryFromFilter(filterBy, '')
      // jest.spyOn(service, 'buildDbQueryFromFilter').mockReturnValue(queryResult)
      const articles = await fakeNewsRepository.getFilteredArticles(query, '', 1)
      // jest.spyOn(fakeNewsRepository, 'getFilteredArticles').mockResolvedValue(mockedArticles)

      // Call the function being tested
      const result = await service.getFilteredArticlesFromDb(filterBy, '', 1)
      expect(result).toEqual(articles)
    })

    it('should return an empty array when repository returns empty', async () => {
      // Mocked input values
      const filterBy: FilterBy = {
        type: 'top-headlines',
        source: '',
        category: 'sports',
        country: 'us',
        language: '',
        sortBy: '',
      }

      // Mock the repository to return an empty array
      jest.spyOn(fakeNewsRepository, 'getFilteredArticles').mockResolvedValue([])

      // Call the function being tested
      const result = await service.getFilteredArticlesFromDb(filterBy, 'trump', 1)

      // Assert that the result is an empty array
      expect(result).toEqual([])
    })
  })

  /* ---------------------------------------------------------------------------------------------------------- */

  describe('getNextParameter', () => {
    it('should toggle between country and category top-headlines', () => {
      service.useCountry = true
      const countryRes = service.getNextParameter(FilterOptions.TOP_HEADLINES)
      expect(countryRes).toEqual({ name: 'country', value: 'us' })

      service.useCountry = false
      const categoryRes = service.getNextParameter(FilterOptions.TOP_HEADLINES)
      expect(categoryRes).toEqual({ name: 'category', value: 'business' })

      service.useCountry = true
      service.countryHashMap.index = service.countryHashMap.value.length - 1
      const lastCountry = service.getNextParameter(FilterOptions.TOP_HEADLINES)
      expect(lastCountry).toEqual({ name: 'country', value: 'tw' })
    })
    it('should return the next source parameter for everything', () => {
      service.sourcesHashMap.index = 0;
      const firstSource = service.getNextParameter(FilterOptions.EVERYTHING);
      expect(firstSource).toEqual({ name: 'sources', value: 'abc-news' });

      // Set the index to the last source
      service.sourcesHashMap.index = service.sourcesHashMap.value.length - 1;
      const lastSource = service.getNextParameter(FilterOptions.EVERYTHING);
      expect(lastSource).toEqual({ name: 'sources', value: service.sourcesHashMap.value[service.sourcesHashMap.value.length - 1] });
    });
  })

  /* ---------------------------------------------------------------------------------------------------------- */


})

