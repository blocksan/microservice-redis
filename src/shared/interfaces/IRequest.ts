import { Request } from "express";

export type CustomReq = Request & {requestId: string}