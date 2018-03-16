const moment = require('moment');
module.exports = {
    select: function (selected,options) {
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
    },

    /**
     * @return {string}
     */
    GenerateTime: function (date,format) {
        return moment(date).format(format);
    },

    paginate: function (options) {
        let output = '';
        if (options.hash.current === 1){
            output += `<li class="page-item disabled"><a class="page-link"> First</a></li>`;
        }else {
            output += `<li class="page-item"><a class="page-link" href="?page=1"> First</a></li>`;
        }
        let i = Number(options.hash.current) > 5 ? Number(options.hash.current) - 4  : 1;

        if (i !== 1){
            output += `<li class="page-item"><a class="page-link" href="?page=${options.hash.current-5}">...</a></li>`;
        }

        for (i; i<=Number(options.hash.current)+4 && i <= Number(options.hash.pages); i++){
            if (i===options.hash.current){
                output += `<li class="page-item active"><a class="page-link" href="?page=${i}">${i}</a></li>`;
            }else {
                output += `<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`;
            }
        }

        if (i !== Number(options.hash.current)+4 && Number(options.hash.current) < Number(options.hash.pages) - 4 ){
            output += `<li class="page-item"><a class="page-link" href="?page=${options.hash.current+5}">...</a></li>`;
        }


        if (options.hash.current === options.hash.pages){
            output += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;
        }else {
            output += `<li class="page-item"><a class="page-link" href="?page=${options.hash.pages}">Last</a></li>`;
        }

        return output;
    }

};