import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Protocol = createParamDecorator(
    (defaulValue: unknown, ctx: ExecutionContext) => {
        // untuk test defaultValue yang sudah diset di parameter @Protocol() coffees controller
        console.log({ defaulValue })
        const request = ctx.switchToHttp().getRequest();
        return request.protocol; 
    },
);