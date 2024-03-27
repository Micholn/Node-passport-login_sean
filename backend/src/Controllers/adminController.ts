import { Request, Response } from "express";
import { IsNull } from "typeorm";
import { DbServices } from "../Services/dbServices";
import { mailSend } from "../Services/mailServices";
import { errorRes, saveRes, successRes } from "../Services/responseServices";

let db = new DbServices();
let response: any = {
    
}

export class AdminController {
    public async getUserList(req: Request, res: Response) {
        try {

            let condition: any = {
                select: ['id', 'firstName', 'lastName', 'email', 'mobile', 'websiteUrl', 'companyName', 'status', 'isApprove'],
                where: {
                    role_id: 2
                }
            }
            if (req.query.currentPage && req.query.limit) {
                let perPage = parseInt((req as any).query.limit)
                let pageNumber = parseInt((req as any).query.currentPage)
                condition.take = perPage
                condition.skip = (perPage * pageNumber) - perPage
            } else if (req.query.status) {
                let isApprove = (req.query.status == "a") ? true : (req.query.status == "p") ? IsNull() : (req.query.status == "r") ? false : undefined
                if (isApprove != undefined) {
                    condition.where.isApprove = isApprove;
                } else {
                    condition;
                }
            }
            let [getData, count]: any = await db.getAllBusinessUserDb(condition);
            response.data = getData;
            response.count = count;
            successRes(response, res)
        } catch (error) {
            errorRes(error, res);
        }

    }

    public async getOneUser(req: Request, res: Response) {
        try {
            let condition = {
                relations: ["profile", "role_id"],
                select: ['id', 'firstName', 'lastName', 'email', 'mobile', 'websiteUrl', 'companyName', 'status', 'isApprove', "profile", "role_id"],
                where: {
                    id: req.params.id
                }
            }
            let getData = await db.getOneBusinessUserDb(condition);
            response.data = getData;
            successRes(response, res)
        } catch (error) {
            errorRes(error, res);
        }

    }

    public async approvalUser(req: Request, res: Response) {
        try {
            let whom = {
                id: req.body.id
            }
            let toUpdate = {
                isApprove: req.body.status
            }
            let msg = req.body.status == true ? "approved" : "rejected"
            await db.updateBusinessUserDb(whom, toUpdate);
            let mailOptions = {
                from: process.env.mailfrom || 'vendor@buyherenamerica.com',
                to: req.body.email,
                subject: "Please confirm your Email account",
                html: `<h4 style="text-align: left">BuyHereNAmerica</h4>
                <br>            
                Dear ${req.body.firstName},<br><br>
                 &nbsp;&nbsp;&nbsp;&nbsp;Thanks for getting started with BuyHereNAmerica! <br>
                 your profile is ${msg}
                <br><br>
                Thanks,<br>
                BuyHereNAmerica Service Desk<br>
                mailto: vendor@buyherenamerica.com`
            }
            mailSend(mailOptions);
            saveRes("Data updated successfully", res)
        } catch (error) {
            errorRes(error, res);
        }

    }

    public async getRedirectionList(req: Request, res: Response) {
        try {
            let condition = {
                relations: ['product_id'],
                order: {
                    purchaseCount: "DESC"
                }
            }
            let [getData, count]: any = await db.getAllCountDb(condition);
            response.data = getData;
            response.count = count;
            successRes(response, res);
        } catch (error) {
            errorRes(error, res);
        }
    }


    public async getPopularCategory(req: Request, res: Response) {
        try {
            let condition = {
                order: {
                    count: "DESC"
                }
            }
            let [getData, count]: any = await db.getAllProductCategoryDb(condition);
            response.data = getData;
            response.count = count;
            successRes(response, res)
        } catch (error) {
            errorRes(error, res)
        }

    }


    public async getAllUsersMail(req: Request, res: Response) {
        try {
            let email = req.body.email
            let [getData, count]: any = await db.getAllUserMailDb(email);
            response.data = getData;
            response.count = count;
            successRes(response, res)
        } catch (error) {
            errorRes(error, res)
        }
    }

    public async getAllContactDetail(req: Request, res: Response) {
        try {
            let [getData, count]: any = await db.getAllContactDetailDb({});
            response.data = getData;
            response.count = count;
            successRes(response, res)
        } catch (error) {
            errorRes(error, res)
        }
    }

    public async getOneUserContactdetail(req: Request, res: Response) {
        try {
            let condition = {
                where: {
                    id: req.params.id
                }
            }
            let getData = await db.getOneContactDetailDb(condition);
            response.data = getData;
            successRes(response, res)
        } catch (error) {
            errorRes(error, res);
        }
    }

    public async resolveUser(req: Request, res: Response) {
        try {
            let whom = {
                id: req.body.id
            }
            let toUpdate = {
                isResolve: req.body.status
            }
            await db.updateResolveDb(whom, toUpdate);
            saveRes("Data updated successfully", res)
        } catch (error) {
            errorRes(error, res);
        }

    }

}