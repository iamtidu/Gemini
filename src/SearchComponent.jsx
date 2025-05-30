import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // for mark down
import remarkGfm from 'remark-gfm'; // for other 
import rehypeRaw from 'rehype-raw' // for html 
import { createClient } from 'pexels';
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API);
const client = createClient(import.meta.env.VITE_PIXEL_API);


const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SearchComponent = () => {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState("");
    const [output, setOutput] = useState("");
    const [images, setImages] = useState([])



    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult("Searching....");
        setOutput('Output:')

        try {
            client.photos.search({ query, per_page: 8 }).then(response => {
                console.log(response)
                const photoUrls = response.photos.map(photo => photo.src.large2x);
                setImages(photoUrls);
            });
            const result = await model.generateContent(query);
            const response = await result.response;
            const text = await response.text();
            if (text.length > 0) {
                setResult(text);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setResult("An error occurred while fetching data.");
        }
    };

    return (
        <div className="maindiv">
            <div className="Contentdiv">
                <div className="Heading">
                    <h1>Gemini</h1>
                    <img src="start.gif" alt="star"></img>
                </div>

                <h5>{output}</h5>
                <div className="Result">
                    {result ? (
                        <>
                            <p>images</p>
                            <div className="container">
                                {images.map((url, index) => (
                                    <img key={index} src={url} alt={`Nature ${index}`} />
                                ))}
                            </div>
                            {/* <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} className="fixed-width-pre">{result}</Markdown> */}
                            <div className="fixed-width-pre">
                                <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                                    {result}
                                </Markdown>
                            </div>

                        </>

                    ) : (
                        <div className="display">
                            <h1 className="displayh-1">Hello, Udit</h1>
                            <h1 className="displayh-2">How Can I help You Today?</h1>
                            <h2 className="displayh-3">Gemini</h2>

                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter your query"
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
        </div>
    );
};

export default SearchComponent;


// jab content ka token fix karna hoaga tab use kare ge
// const generationConfig = {
//     stopSequences: ["red"],
//     maxOutputTokens: 200,
//     temperature: 0.9,
//     topP: 0.1,
//     topK: 16,
// };


