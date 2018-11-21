import { stringify } from 'qs';
import request from '@/utils/request';

// parcel
export const queryParcels = async () => request('/api/parcels');

export const queryParcel = async id => request(`/api/parcels/${id}`);


export const updateParcels = async item => request('/api/parcels', {
    method: 'POST',
    body: item,
  })

export const queryPackList = async (id, params) =>
  request(`/api/parcels/${id}/packs?${stringify(params)}`);

export const removePack = async (parcelID, id) =>
  request(`/api/parcels/${parcelID}/packs/${id}`, {
    method: 'DELETE',
  });

export const addPackList = async params => {
  const { parentID, ...restParams } = params;
  return request(`/api/parcels/${parentID}/packs`, {
    method: 'POST',
    body: {
      ...restParams,
    },
  });
};
