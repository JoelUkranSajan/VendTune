import pandas as pd
import geopandas as gpd
import numpy as np
from shapely.wkt import loads
from ..models import ZoneBusynessScore, ZonedStreet
import time

def get_zones_scores(target_datetime):
    """
    Retrieve and process zone busyness scores for a given datetime

    Queries the `ZoneBusynessScore` model for records that match
    the specified `target_datetime`. Converts the `centroid` field from 
    EWKT format to WKT format to geometric objects, then stores the results in a Pandas DataFrame.

    Args:
        target_datetime (datetime): The datetime for which to retrieve zone busyness scores.

    Returns:
        pd.DataFrame: A DataFrame containing the busyness scores for each zone with 
                    the `centroid` field converted to geometric objects.
    """

    zones_scores = list(ZoneBusynessScore.objects.filter(hour=target_datetime).values())

    for zone in zones_scores:
        zone['centroid'] = zone['centroid'].wkt

    zones_scores_df = pd.DataFrame(zones_scores)
    zones_scores_df['centroid'] = zones_scores_df['centroid'].apply(loads)

    return zones_scores_df


def get_zoned_streets(zone=None):
    """
    Retrieve and process zoned street information for a specific zone or all zones

    Queries the `ZonedStreet` model to retrieve street information.
    If a specific zone is provided, it filters streets by the given `zone_id`.
    Otherwise, it retrieves streets for all zones. The `street_centroid` field
    is converted from EWKT format to WKT format to geometric objects. The results 
    are then stored in a GeoDataFrame with EPSG:4326 CRS.

    Args:
        zone (int, optional): The ID of the zone for which to retrieve street information.
                            Defaults to None, which retrieves streets for all zones.

    Returns:
        gpd.GeoDataFrame: A GeoDataFrame containing the zoned streets information with
                        the `street_centroid` field converted to geometric objects and
                        set to the 'EPSG:4326' CRS if not already set.
    """

    if zone:
        zoned_streets = list(ZonedStreet.objects.filter(zone_id=zone).values('street_address', 'street_centroid'))
    else:
        zoned_streets = list(ZonedStreet.objects.values('street_centroid'))

    for street in zoned_streets:
        street['street_centroid'] = street['street_centroid'].wkt

    zoned_streets_df = pd.DataFrame(zoned_streets)
    zoned_streets_df['street_centroid'] = zoned_streets_df['street_centroid'].apply(loads)

    zoned_streets_gdf = gpd.GeoDataFrame(zoned_streets_df, geometry='street_centroid')

    if zoned_streets_gdf.crs is None:
        zoned_streets_gdf = zoned_streets_gdf.set_crs('EPSG:4326')

    return zoned_streets_gdf


def calculate_scores(geometry, zones_scores_df):
    """
    Calculate the busyness score for a given geometry (i.e. street) based on the distances to zone centroids.

    Computes the distance from a given geometry to the centroids of zones. 
    It calculates the busyness score by dividing each zone's score
    by the square of the distance to the geometry and returns the sum of these weighted scores.

    Args:
        geometry (shapely.geometry.base.BaseGeometry): The geometric object for which to calculate the score.
        zones_scores_df (pd.DataFrame): A DataFrame containing zone scores and their centroids.
                                        Must contain 'centroid' and 'score' columns.

    Returns:
        float: The weighted score for the given geometry.
    """
    distances = geometry.distance(zones_scores_df['centroid'])
    squared_distances = distances ** 2
    scores = zones_scores_df['score']
    return np.sum(scores / squared_distances)


def scale_scores(scores, new_min=0, new_max=10):
    """
    Scale a list of scores to a new range.

    Rescales the values in a list of scores to a specified range 
    (default is 0 to 10). The scaling is done using min-max normalization.
    Done primarily for facilitating heatmapping.

    Args:
        scores (list of float): The list of scores to be scaled.
        new_min (float, optional): The minimum value of the new range. Defaults to 0.
        new_max (float, optional): The maximum value of the new range. Defaults to 10.

    Returns:
        list of float: The scaled scores.
    """

    min_score = min(scores)
    max_score = max(scores)

    scaled_scores = [(new_max - new_min) * (score - min_score) / (max_score - min_score) + new_min for score in scores]
    return scaled_scores


def estimate_busyness(target_datetime, zone=None):
    """
    Estimate the busyness scores for streets within a specified zone and time.

    Combines previous functions.

    Args:
        target_datetime (datetime): The datetime for which to estimate busyness scores.
        zone (int, optional): The ID of the zone for which to estimate busyness scores.
                            Defaults to None, which considers all zones.

    Returns:
        gpd.GeoDataFrame: A GeoDataFrame containing the streets with their estimated
                        busyness scores scaled to the range 0 to 10.
    """
    start_time = time.time()

    zones_scores = get_zones_scores(target_datetime)
    zoned_streets = get_zoned_streets(zone)

    zoned_streets['score'] = zoned_streets['street_centroid'].apply(lambda geom: calculate_scores(geom, zones_scores)) / 10 ** 5
    zoned_streets['score'] = scale_scores(zoned_streets['score'], new_min=0, new_max=10)

    print("Execution time: ", time.time() - start_time)

    return zoned_streets



