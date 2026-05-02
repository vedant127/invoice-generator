import math
from typing import Any, List, Optional
from pydantic import BaseModel

class Page(BaseModel):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int

def paginate(items: List[Any], page: int, size: int) -> Page:
    total = len(items)
    pages = math.ceil(total / size)
    start = (page - 1) * size
    end = start + size
    
    return Page(
        items=items[start:end],
        total=total,
        page=page,
        size=size,
        pages=pages
    )
