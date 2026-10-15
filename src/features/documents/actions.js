import {setState} from '../../core/store.js';
import {documentsService} from '../../services/documents.service.js';
export const refreshDocs=async(extra={})=>setState({docs:await documentsService.list(),...extra});
