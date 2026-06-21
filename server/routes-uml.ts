/**
 * UML Diagrams Routes
 * API endpoints for serving UML diagram data to the in-game viewer
 */

import type { Express, Request, Response } from 'express';
import { isAuthenticated } from './basicAuth';
import { UML_DIAGRAMS, UML_CATEGORIES } from '../shared/config/umlDiagramData';

export function registerUmlRoutes(app: Express) {

  app.get('/api/uml/diagrams', isAuthenticated, (_req: Request, res: Response) => {
    try {
      const diagrams = UML_DIAGRAMS.map(d => ({
        id: d.id,
        title: d.title,
        description: d.description,
        category: d.category,
        classCount: d.classes.length,
        relationshipCount: d.relationships.length,
      }));
      res.json({ success: true, data: diagrams });
    } catch (error: any) {
      console.error('Error fetching UML diagrams:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/uml/diagrams/:id', isAuthenticated, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const diagram = UML_DIAGRAMS.find(d => d.id === id);
      if (!diagram) {
        res.status(404).json({ success: false, error: 'Diagram not found' });
        return;
      }
      res.json({ success: true, data: diagram });
    } catch (error: any) {
      console.error('Error fetching UML diagram:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/uml/categories', isAuthenticated, (_req: Request, res: Response) => {
    try {
      res.json({ success: true, data: UML_CATEGORIES });
    } catch (error: any) {
      console.error('Error fetching UML categories:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/uml/stats', isAuthenticated, (_req: Request, res: Response) => {
    try {
      const totalClasses = UML_DIAGRAMS.reduce((sum, d) => sum + d.classes.length, 0);
      const totalRelationships = UML_DIAGRAMS.reduce((sum, d) => sum + d.relationships.length, 0);
      const categoryCounts = UML_CATEGORIES.map(cat => ({
        ...cat,
        count: UML_DIAGRAMS.filter(d => d.category === cat.id).length,
      }));
      res.json({
        success: true,
        data: {
          totalDiagrams: UML_DIAGRAMS.length,
          totalClasses,
          totalRelationships,
          categories: categoryCounts,
        },
      });
    } catch (error: any) {
      console.error('Error fetching UML stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
