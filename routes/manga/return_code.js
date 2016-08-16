exports.getErrorCode = function(TYPE){
	if(TYPE == 'QUERY_ERROR')
		return "{'error':'An error has occurred'}";
	else if(TYPE == 'QUERY_EMPTY')
		return "{}";
}

exports.getReturnCode = function(TYPE){
	if(TYPE == 'QUERY_ERROR')
		return {ret:'error', ret_info:'data query error'};
	else if(TYPE == 'QUERY_EMPTY')
		return {ret:'ok', count:0};
	else if(TYPE == 'QUERY_OK')
		return {ret:'ok'};
	else if(TYPE == 'FILE_ERROR')
		return {ret:'error', ret_info:'file error'};
}