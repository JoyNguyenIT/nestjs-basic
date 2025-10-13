import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from 'src/auth/decorators/public.decorator';

export interface Response<T> {
    statusCode: number;
    message: string;
    data: any;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {

    constructor(private reflector: Reflector) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        const message = this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
        );
        return next
            .handle()
            .pipe(
                map((data) => ({
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: message,
                    data: data,
                    meta: data?.meta ? data?.meta : {}// if this is supposed to be the actual return then replace {} with data.result

                })),
            );
    }
}