import { Injectable, Inject } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
    constructor(
        /** Inject request */
        @Inject(REQUEST)
        private readonly request: Request
    ){}
    public async paginateQuery<T extends ObjectLiteral>(
        paginationQuery: PaginationQueryDto,
        repository: Repository<T>
    ): Promise<Paginated<T>>{
        let results = await repository.find({
            skip: ((paginationQuery.page?? 1) - 1 ) * (paginationQuery.limit ?? 10),
            take: paginationQuery.limit ?? 10
        })

        // create request URLs
        const baseURL = this.request.protocol + '://' + this.request.headers.host + '/'
        const newURL = new URL(this.request.url, baseURL);

        /** calculate pagination page  */
        const totalItems = await repository.count();
        const totalPages = await Math.ceil(totalItems/(paginationQuery.limit ?? 10 ))
        const nextPage = paginationQuery.page === totalPages ? paginationQuery.page : (paginationQuery.page ?? 10 ) + 1
        const previousPage = paginationQuery.page === 1 ? paginationQuery.page : (paginationQuery.page ?? 10 ) - 1

        const finalResponse: Paginated<T>  = {
            data: results,
            meta:{
                itemsPerPage: paginationQuery.limit?? 10,
                totalItems : totalItems,
                currentPage: paginationQuery.page ?? 1,
                totalPages: totalPages,
            },
            links: {
                first: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=1`,
                last: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
                current: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
                next: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
                previous: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
            }

        }


        return finalResponse;
    }
}