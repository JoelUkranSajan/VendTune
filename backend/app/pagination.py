from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class Pagination(PageNumberPagination):
    page_query_param = 'page' 

    page_size_query_param = 'size' 
    page_size = 5
    max_page_size = 100


    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'total_items': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'page_size': self.get_page_size(self.request),
            'results': data
        })
    '''
    links:

    Contains paginated navigation links to get data for the next and previous pages.
    next: self.get_next_link() Returns the link(URL) to the next page. If there is no next page, Null is returned.
    previous: self.get_previous_link() Returns the link(URL) from the previous page. If there is no previous page, Null is returned.
    
    total_items:
    
    Returns the total number of records in the paging object.
    Value: self.page.paginator.count, said query to the total number of entries.
    
    total_pages:
    
    Return the total number of pages in the paging object.
    Value: self.page.paginator.num_pages, which represents the total number of pages that can be paged in the query set.
    
    current_page:
    
    Return the current page number.
    Value: self.page.number, which indicates the page number of the current request.
    page_size:
    
    Return the number of records per page.
    Value: self.page_size, which indicates the number of records per page. If the page_size parameter is specified in the request, the specified value is returned.
    
    results:
    
    Contains the actual data record of the current page.
    Value: data, which is the serialized data passed to the get_paginated_response method.
    '''