#!/usr/bin/env python3

import json
import logging
from typing import Any
import requests

lr = logging.Logger("main")
lr.warning("Launched")


EDGEDB_URL = "https://cokeryen--anieuwland.c-21.i.aws.edgedb.cloud:5656/branch/dev/edgeql"
# EDGEDB_URL = "http://edgedb:buaJdbarJpiHEle3zsKe6iY8@localhost:10702/branch/dev/edgeql"
EDGEDB_AUTH_STR = "Bearer nbwt1_eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlZGIuZC5hbGwiOnRydWUsImVkYi5pIjpbImFuaWV1d2xhbmQvY29rZXJ5ZW4iXSwiZWRiLnIuYWxsIjp0cnVlLCJpYXQiOjE3MjUyMTMxOTQsImlzcyI6ImF3cy5lZGdlZGIuY2xvdWQiLCJqdGkiOiJFQTlJVkdpTEVlLWNLZXVleFk4aElnIiwic3ViIjoiSVJnZHBFMElFZS1EUWFldDZEUnphZyJ9.UmhmLZhoD7iqJMwij3ATmav54QnxUFrKkaJlGQxsKi8I7kHGPdY7Ur_PCa0PVpau-UQJ1W_OIokn2S7TRd0DVw"
client = requests


def submit_book(data: dict[str, Any], submit = False):
    q_book = f"""RecipeBook {{
            modernized := {'true' if data['modernized'] else 'false'},
            person := "{data['person']}",
            reference := "{data['reference']}",
            title := "{data['title']}",
            transcriber := "{data['transcriber']}",
            year := <int16>{data['year']},
        }}
    """
    insertion = f"""INSERT {q_book}"""
    if submit:
        _submit_edgeql(insertion)
    return q_book


def submit_recipe_variant(data: dict[str, Any]):
    insertion = f"""
        insert RecipeVariant {{
            ingredients := {data['ingredients']},
            instructions := <str>'{data['instructions']}',
            title := <str>'{data['title']}',
        }}
    """
    return _submit_edgeql(insertion)


def update_recipe_entry_with_modernization(data: dict[str, Any], entry_id: str):
    result = submit_recipe_variant(data)
    insertion = f"""
        update RecipeEntry filter .id = <uuid>'{entry_id}'
        set {{
            modernized := (select RecipeVariant filter .id = <uuid>"{result['id']}")
        }}
    """
    return _submit_edgeql(insertion)


def submit_recipe_entry(data, book: dict[str, Any]): 
    insertion = f"""
        insert RecipeEntry {{
            book := (select RecipeBook filter RecipeBook.reference = "{book['reference']}"),
            historical := (select RecipeVariant filter .id = <uuid>"{data['historical']}"),
            number := <int16>{data['number']},
            tags := {data["tags"]},
            visualization := "{data["visualization"]}",
        }}
    """
    return _submit_edgeql(insertion)


def _submit_edgeql(q: str, **kwargs) -> dict[str, Any]:
    lr.warning(f"Submitting: {q}")
    headers = {"Authorization": EDGEDB_AUTH_STR}
    params = {"query": q, "global": {"current_user": 'e3665608-d8a1-4779-a396-f68437747839'}}
    response = client.post(EDGEDB_URL, json=params, headers=headers)
    # response = client.post(EDGEDB_URL, json=params)
    response.raise_for_status()
    lr.warning(response.content)
    data = response.json()
    if "message" in (err := data.get("error", {})): 
        raise Exception(f"{err['message']} [{err['code']}]")
    return response.json()['data'][0]


def lst_to_str_tuple(ingr: list[str]) -> str:
    return f'("{ingr[0]}", "{ingr[1]}")'


BOOKS_FILE = "books.json"
with open(BOOKS_FILE, "r") as fh:
    books: list[dict[str, Any]] = json.load(fh)

books_by_ref = {}
for book in books: 
    submit_book(book, True)
    books_by_ref[book['reference']] = book


RECIPES_FILE = "recipes.json"
with open(RECIPES_FILE, "r") as fh:
    recipes: list[dict[str, Any]] = json.load(fh)

# recipes = [r for r in recipes if r.get("bookRef") in ["GENT1499"]][:2]
for i, recipe in enumerate(recipes):
    historical = {
        "ingredients": [],
        "instructions": recipe["instructions"].replace("'", r"\'").strip(),
        "title": recipe["title"].capitalize().replace("'", r"\'").strip(),
    }
    result = submit_recipe_variant(historical)

    entry = {
        "tags": recipe.get("modernized", {}).get("tags", []),
        "number": recipe["id"],
        "visualization": recipe.get("modernized", {}).get("visualized", "").replace("'", r"\'").strip(),
        "historical": result['id'],
    }
    entry = submit_recipe_entry(entry, books_by_ref[recipe['bookRef']])

    if "modernized" in recipe:
        ingrs = [lst_to_str_tuple(ingr) for ingr in recipe["modernized"]["ingredients"]]
        ingrs_str = "[" + ", ".join(ingrs) + "]"
        modernized = {
            "ingredients": ingrs_str,
            "instructions": recipe["modernized"]["recipe"].replace("'", r"\'").strip(),
            "title": recipe["modernized"]["title"].capitalize().replace("'", r"\'").strip(),
        }
        update_recipe_entry_with_modernization(modernized, entry['id'])
