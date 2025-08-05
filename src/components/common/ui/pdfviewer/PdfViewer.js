import React, { useState, useEffect } from 'react'
import { downloadResourceAPI } from '../../../../services/apiservices';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import './PdfViewer.scss'

const PdfViewer = ({ category, subcategory }) => {
    const [pdfData, setPdfData] = useState(null);

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance

    useEffect(() => {
        const fetchPdf = async () => {
            return downloadResourceAPI(category, subcategory);
        };
        fetchPdf()
            .then(response => {
                const fileURL = window.URL.createObjectURL(new Blob([response.data]));
                setPdfData(fileURL);

            }).catch((error) => {
                console.log("Error fetchind the PDF", error);
            });
        fetchPdf();
    }, []);

    return (
        <>
            <div> {pdfData ? (<Toolbar></Toolbar>) : ''}</div>
            <div style={{ height: '520px', width: '100%' }}>
                {pdfData ? (
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                        <Viewer fileUrl={pdfData} plugins={[toolbarPluginInstance]} defaultScale={1}/>
                    </Worker>
                ) : (<p>Loading Document...</p>)
                }
            </div>
        </>
    )
}

export default PdfViewer
