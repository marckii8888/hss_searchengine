from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Turn

import re
'''
To-dos:
1. Add the new site (php?) into it
'''
def index(request):
    return render(request, 'search/index.html')

def search(request):
    query = request.GET.get('q')
    if(query):
        if(re.findall('\[(.*?)\]', query)):
            bracket_flag = True
            words_to_find = re.findall('\[(.*?)\]', query)
        else:
            bracket_flag = False
            words_to_find = []

        if('.' in query):
            # If query contains X.Y, X..Y, X...Y
            results = wordBetween(query, bracket_flag, words_to_find)
        elif('*' in query):
            # If query is X*Y
            results = anyNumberInBetween(query, bracket_flag, words_to_find)
        elif(query[0] == 'w'):
            # If query is wX
            results = startWithChar(query)
        elif(query[-1] == 'w'):
            # If query is Xw
            results = endsWithChar(query)
        elif(query[-1] == 'X' and query[0] == 'X'):
            # If query is X word X
            results = middleWords(query)
        else:
            # Normal search
            results = simple_search(query, bracket_flag, words_to_find)
    else:
        results = []

    return render(request, 'search/index.html', {'results': results, 'query': query})


def simple_search(query, bracket_flag, words_to_find):
    '''
    Simply search all instances of query
    '''
    if(bracket_flag):
        word = re.findall('(.*?)\[', query)[0]
        words_to_find = words_to_find[0].strip().replace(' ', '')
        reg_ex = f'{word}[{words_to_find}]'
    else:
        reg_ex = f'{query}'
        word = query

    results = Turn.objects.filter(sentence__iregex=reg_ex)
    return_list = []
    count=1
    for item in results:  # item.speaker, item.sentence
        a = [(m.start(0), m.end(0)) for m in re.finditer(reg_ex, item.sentence)]
        for i in range(len(a)):
            return_list.append({
                'speaker': item.speaker,
                'left': item.sentence[:a[i][0]],
                'keyword': item.sentence[a[i][0]:a[i][1]],
                'right': item.sentence[a[i][1]:],
                'id': item.pk,
                'count':count,
                })

            count+=1
    return return_list


def wordBetween(query, bracket_flag, words_to_find):
    '''
    Account for only X word in between
    E.g. X...Y, X..Y, X.Y
    '''
    if(bracket_flag):
        word = re.findall('(.*?)\[', query)[0]
        words_to_find = words_to_find[0].strip().replace(' ', '')
        reg_ex = f'{word}[{words_to_find}]'
        results = Turn.objects.filter(sentence__regex = reg_ex)
    else:
        reg_ex = f'{query}'
        results = Turn.objects.filter(sentence__regex=reg_ex)
    
    return_list = []
    count = 1
    for item in results:
        a = [(m.start(0), m.end(0)) for m in re.finditer(reg_ex, item.sentence)]
        return_list.append({
            'speaker': item.speaker,
            'left': item.sentence[:a[0][0]],
            'keyword': item.sentence[a[0][0]:a[0][1]],
            'right': item.sentence[a[0][1]:],
            'id': item.pk,
            'count':count,
            })
        count+=1
    return return_list


def anyNumberInBetween(query, bracket_flag, words_to_find):
    '''
    X*Y. Find X and Y and any number of words inbetween
    regex used = '迎(.*?)乐'
    '''

    if(bracket_flag):
        word = re.findall('(.*?)\[', query)[0]
        word = word.replace('*', '(.*?)')
        words_to_find = words_to_find[0].strip().replace(' ', '')
        reg_ex = f'{word}[{words_to_find}]'
        results = Turn.objects.filter(sentence__regex = reg_ex)
    else:
        reg_ex = query.replace('*', '(.*?)')
        results = Turn.objects.filter(sentence__regex=reg_ex)
    
    return_list = []
    count=1

    for item in results:
        a = [(m.start(0), m.end(0)) for m in re.finditer(reg_ex, item.sentence)]
        return_list.append({
            'speaker': item.speaker,
            'left': item.sentence[:a[0][0]],
            'keyword': item.sentence[a[0][0]:a[0][1]],
            'right': item.sentence[a[0][1]:],
            'id':item.pk,
            'count':count,
            })
        count+=1
            
    return return_list


def startWithChar(query):
    '''
    wX - Any char that starts with w
    '''
    query = query.replace('w', '^')
    results = Turn.objects.filter(sentence__regex=query)
    return_list = []
    count=1
    for item in results:
        a = [(m.start(0), m.end(0)) for m in re.finditer(query, item.sentence)]
        return_list.append({
            'speaker': item.speaker,
            'left': "",
            'keyword': item.sentence[:a[0][1]],
            'right': item.sentence[a[0][1]:],
            'id':item.pk,
            'count':count
        })
        count+=1
    return return_list


def endsWithChar(query):
    '''
    Xw - any sentences that ends with w
    Regex used = X$
    '''
    query = query.replace('w', '')
    query += '$'
    results = Turn.objects.filter(sentence__regex=query)
    return_list = []
    count=1

    for item in results:
        a = [(m.start(0), m.end(0)) for m in re.finditer(query, item.sentence)]
        return_list.append({
            'speaker': item.speaker,
            'left': item.sentence[:a[0][0]],
            'keyword': item.sentence[a[0][0]:],
            'right': "",
            'id': item.pk,
            'count':count
        })
        count+=1

    return return_list


def pairs(request):
    results = pairWords()
    query = True
    return render(request, 'search/index.html', {'results': results, 'query':query})


def pairWords():
    '''
    XX - returns all sentences with that pair words.
    Make it into a radio button
    '''
    reg_ex = "(.)\\1"
    results = Turn.objects.filter(sentence__regex = reg_ex)

    return_list = []
    count=1

    for item in results:
        a = [(m.start(0), m.end(0)) for m in re.finditer(reg_ex, item.sentence)]
        if not (all(u'\u4e00' <= c <= u'\u9fff' for c in item.sentence[a[0][0]: a[0][1]])):
            continue

        for i in range(len(a)):
            return_list.append({
                'speaker':item.speaker,
                'left': item.sentence[:a[i][0]],
                'keyword' : item.sentence[a[i][0]: a[i][1]],
                'right': item.sentence[a[i][1]:],
                'id': item.pk,
                'count':count
            })
            count+=1
    return return_list


def middleWords(query):
    '''
    X{word}X returns all sentences with that middle word
    regex used = (.*?)word(.*?)
    r'(?:\S+\s)?\S*欢\S*(?:\s\S+)?
    '''
    reg_ex = query.replace('X', '[^\W!,。]')
    results = Turn.objects.filter(sentence__regex = reg_ex)
    return_list = []
    count=1

    for item in results:
        a = [(m.start(0), m.end(0)) for m in re.finditer(reg_ex, item.sentence)]
        if(item.sentence[a[0][0]] == item.sentence[a[0][1] - 1]):
            return_list.append({
                'speaker': item.speaker,
                'left' : item.sentence[:a[0][0]],
                'keyword': item.sentence[a[0][0] : a[0][1]],
                'right': item.sentence[a[0][1]:],
                'id' : item.pk,
                'count':count
            })
        count+=1

    return return_list


def search_more(request, turn_id):
    results = turn_id
    before = Turn.objects.filter(pk=turn_id-1)
    current = Turn.objects.filter(pk=turn_id)
    after = Turn.objects.filter(pk=turn_id+1)
    results = {
        'before_speaker':before[0].speaker,
        'before_sentence': before[0].sentence,
        'current_speaker':current[0].speaker,
        'current_sentence': current[0].sentence,
        'after_speaker':after[0].speaker,
        'after_sentence': after[0].sentence,
    }
    return render(request, 'search/search.html', {'results': results})