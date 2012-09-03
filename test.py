import re,collections

def words(text):
    return re.findall('[a-z]+',text.lower())

def train(fetures):
    model = collections.defaultdict(lambda:1)
    for f in fetures:
        model[f] += 1
    return model

def edits1(word):
    splits = [(word[:i],word[i:) for i in len(word)]
