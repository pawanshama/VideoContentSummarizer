import express, { Request, Response } from 'express';
const router = express.Router();
import PDFDocument from 'pdfkit';
import { AppDataSource } from '../data-source';
import { Summary } from '../entity/Summary';

export const getPdf = async (req: Request, res: Response) => {

  try {
    const id = req.params.id;
    const summaryRepository = AppDataSource.getRepository(Summary);
    const summary = await summaryRepository.findOneBy({ id });
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="document.pdf"`);

    doc.pipe(res);

    if (summary) {
      doc.fontSize(16).text(summary?.summary_text, {
        align: 'left',
        lineGap: 10,
      });
    }
    else {
      return res.status(404).json({ error: `Summary with ID ${id} not found` });
    }
    doc.end();
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return res.status(500).json({ error: 'Failed to generate and upload PDF' });
  }
};

export const getSummary = async (req: Request, res: Response) => {
   try{
        const id = req.params.id;
        const summaryRepository = AppDataSource.getRepository(Summary);
        const summary = await summaryRepository.findOneBy({ id });
        if (!summary) {
            return res.status(404).json({ error: `Summary with ID ${id} not found` });
        }
        res.status(200).json({
            id: summary.id,
            title: "shared summary",
            summary_text: summary.summary_text,
            thumbnail: summary.public_id ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/so_1,w_400,h_300,c_fill/${summary.public_id}.jpg` : null,
            createdAt: summary.created_at
        });
   }
   catch(error){
     console.error("Error in get-Summary", error);}
}
export default router;