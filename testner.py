import spacy

# Path to your custom NER model directory
model_path = "C:/Users/ACER/Documents/Kuliah/Semester 6/KKP/Trending Topic/spacyndo-1.0/Models/Spacy 2.1.x/NER/id_ud-tag-dep-ner-1.0.0/id_ud-tag-dep-ner/id_ud-tag-dep-ner-1.0.0"

# Load the custom NER model
nlp = spacy.load(model_path)

# Example text for NER processing
text = "Apple Inc. is planning to open a new store in New York City."

# Process the text with the NER model
doc = nlp(text)

# Print the entities found by the NER model
for ent in doc.ents:
    print(ent.text, ent.label_)
