import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a descriptive adjective.
      Animal: Cat
      Names: furry, sratchy, milk
      Animal: Dog
      Names: Ruff, Canine, Barks
      Animal: ${capitalizedAnimal}
      Names:`;
}

export default async function search(req, res) {
   const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: generatePrompt(req.query.animal),
    temperature: 0.6,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}
