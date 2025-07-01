import express,{Request,Response} from 'express';
const router = express.Router();
import PDFDocument from 'pdfkit';
import { AppDataSource } from '../data-source';
import { Summary } from '../entity/Summary';

export const getPdf =  async (req:Request, res:Response) => {

  try {
    const id = req.params.id;
    const summaryRepository = AppDataSource.getRepository(Summary);
    const summary =await summaryRepository.findOneBy({id});

    // Create a PDF document
    const doc = new PDFDocument();

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="document.pdf"`);

    // Pipe PDF output directly to response
    doc.pipe(res);

    // Add content to the PDF
    if(summary){

      doc.fontSize(16).text(summary?.summary_text || 'No content received.', {
        align: 'left',
        lineGap: 10,
      });
    }
    else{
      doc.fontSize(16).text('No content received.', {
        align: 'left',
        lineGap: 10,
      });
    }

    // Finalize PDF and end stream
    doc.end();
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return res.status(500).json({ error: 'Failed to generate and upload PDF' });
  }
};

export default router;