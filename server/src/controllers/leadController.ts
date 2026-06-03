import { Request, Response, NextFunction } from 'express';
import { leadService } from '../services/leadService';
import {
  createLeadSchema,
  updateLeadSchema,
  queryLeadsSchema,
  searchLeadsSchema,
} from '../validators/leadValidators';
import { successResponse, errorResponse } from '../utils/responseFormatter';

export class LeadController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      const lead = await leadService.createLead(parsed.data);
      res.status(201).json(successResponse(lead, 'Lead created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = queryLeadsSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json(errorResponse('Invalid query parameters'));
        return;
      }

      const { leads, meta } = await leadService.getLeads(parsed.data);
      res.json(successResponse(leads, undefined, meta));
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = searchLeadsSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json(errorResponse('Search query is required'));
        return;
      }

      const { leads, meta } = await leadService.searchLeads(parsed.data);
      res.json(successResponse(leads, undefined, meta));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const lead = await leadService.getLeadById(id);
      res.json(successResponse(lead));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      const id = req.params.id as string;
      const lead = await leadService.updateLead(id, parsed.data);
      res.json(successResponse(lead, 'Lead updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await leadService.deleteLead(id);
      res.json(successResponse(result, 'Lead deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await leadService.getStats();
      res.json(successResponse(stats));
    } catch (error) {
      next(error);
    }
  }

  async getCompanies(_req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await leadService.getCompanies();
      res.json(successResponse(companies));
    } catch (error) {
      next(error);
    }
  }
}

export const leadController = new LeadController();
