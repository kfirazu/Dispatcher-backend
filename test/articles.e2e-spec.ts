import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from './test.module'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common';
import { Model } from 'mongoose';
import { ArticleDocument } from 'src/news/article.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('Your Test Suite', () => {
    let app: INestApplication;
    let articleModel: Model<ArticleDocument>

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [TestModule],
        }).compile();

        app = testingModule.createNestApplication(); // Get the actual app instance
        await app.init();

        articleModel = testingModule.get<Model<ArticleDocument>>(getModelToken('Article'))

    })

    afterEach(async () => {
        await articleModel.deleteMany({})
        await app.close()
    });

    describe('fetch artciles from api and save to db', () => {
        it('Handles a fetch request from api', async () => {
            const filterBy = {
                type: 'top-headlines',
                source: '',
                category: '',
                country: 'il',
                language: '',
                sortBy: '',
                // from?: Date
                // to?: Date)
            }
            return request(app.getHttpServer())
                .post('/news/save')
                .send({
                    filterBy: filterBy,
                    searchQuery: '',
                    page: 1
                })
                .expect(201)
                .then((res) => {
                    console.log('res.status API:', res.status)
                    console.log('res.body API:', res.body)
                    const { body, } = res

                    expect(res.status).toBe(201)
                    // expect(res.body).toBe({})
                })
        });
    })
    describe('fetch artciles db', () => {
        it('handles a fetch request from the database', async () => {
            const filterBy = {
                type: 'top-headlines',
                source: '',
                category: '',
                country: 'il',
                language: '',
                sortBy: '',
                // from?: Date
                // to?: Date)
            }
            return request(app.getHttpServer())
                .post('/news/articles')
                .send({
                    filterBy: filterBy,
                    searchQuery: '',
                    page: 1
                })
                .expect(201)
                .then((res) => {
                    console.log('res.status DB:', res.status)
                    console.log('res.body DB:', res.body)

                    expect(res.status).toBe(201)
                    expect(Array.isArray(res.body)).toBe(true);

                    res.body.forEach(article => {
                        expect(article).toHaveProperty('_id')
                        expect(article).toHaveProperty('source')
                        expect(article).toHaveProperty('author')
                        expect(article).toHaveProperty('title')
                        expect(article).toHaveProperty('description')
                        expect(article).toHaveProperty('url')
                        expect(article).toHaveProperty('urlToImage')
                        expect(article).toHaveProperty('publishedAt')
                        expect(article).toHaveProperty('content')
                        expect(article).toHaveProperty('tags')



                    })


                })
        })
    })
    it('should fail to find articles inside db', async () => {
        const filterBy = {
            type: 'non existing type',
            source: '',
            category: '',
            country: '',
            language: '',
            sortBy: '',
            // from?: Date
            // to?: Date)
        }
        return request(app.getHttpServer())
            .post('/news/articles')
            .send({
                filterBy: filterBy,
                searchQuery: '',
                page: 1
            })
            .expect(201)
            .then((res) => {
                console.log('res.status DB:', res.status)
                console.log('res.body DB:', res.body)
                expect(res.body).toEqual([])

            })
    });
    it('should fail to fetch articles from api', async () => {
        const filterBy = {
            type: 'everything',
            source: '',
            category: '',
            country: '',
            language: '',
            sortBy: '',
            // from?: Date
            // to?: Date)
        }
        return request(app.getHttpServer())
            .post('/news/save')
            .send({
                filterBy: filterBy,
                searchQuery: '',
                page: 1
            })
            .expect(500)
            .then((res) => {
                // console.log('res.status DB:', res.status)
                // console.log('res.body DB:', res.body)
                // expect(res.body).toEqual([])

            })
    });
    it('should fail to fetch articles from api due to unacceptable parameter', async () => {
        const filterBy = {
            type: 'everything',
            source: '',
            category: 'sports',
            country: '',
            language: '',
            sortBy: '',
            // from?: Date
            // to?: Date)
        }
        return request(app.getHttpServer())
            .post('/news/save')
            .send({
                filterBy: filterBy,
                searchQuery: '',
                page: 1
            })
            .expect(500)
            .then((res) => {
                console.log('res.status DB:', res.status)
                console.log('res.body DB:', res.body)
                // expect(res.body).toEqual([])

            })
    });
    it('should throw status code 400 and fail in fetch articles from api due to unacceptable parameters', async () => {
        const filterByToInsert = {
            type: 'top-headlines',
            source: '',
            category: '',
            country: 'il',
            language: '',
            sortBy: '',
        };

        // First, insert data into the database
        await request(app.getHttpServer())
            .post('/news/save')
            .send({
                filterBy: filterByToInsert,
                searchQuery: '',
                page: 1,
            })
            .expect(201);

        // Now, attempt to fetch data with invalid filterBy properties
        const filterBy = {
            type: 1,
            source: '',
            category: 'sports',
            country: '',
            language: '',
            sortBy: '',
        };

        return request(app.getHttpServer())
            .post('/news/article')
            .send({
                filterBy: filterBy,
                searchQuery: '',
                page: 1,
            })
            .expect(400)
            .then((res) => {
                console.log('res.status:', res.status);
                console.log('res.body:', res.body);
                // Expectations can be added here
            });
    });

})