import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsService {
    constructor() { }
    test() {
        console.log('This is a test function from newsService')
    }
}
