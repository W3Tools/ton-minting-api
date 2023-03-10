import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../../lib/decorators/public.decorator.js';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }

        if (context.getType() == 'http') {
            return super.canActivate(context);
        } else {
            // graphql
            const ctx = GqlExecutionContext.create(context);
            const { req } = ctx.getContext();
            return super.canActivate(new ExecutionContextHost([req]));
        }
    }

    handleRequest(err, user, info) {
        if (err || !user) throw err || new UnauthorizedException();
        return user;
    }
}
