$(function() {
    let search = instantsearch({
        appId: '4U2NCQ3L4M',
        apiKey: 'b997bca8322aa226a750e1b91c7c3ea1', // search-only API key
        indexName: 'Recipes',
        searchFunction: function(helper) {
            var searchResults = $('#homeSearchHits');
            if (helper.state.query === '') {
                searchResults.hide();
                return;
            }
            helper.search();
            searchResults.show();
        }
    });

    search.addWidget(
        instantsearch.widgets.searchBox({
            container: '#homeSearch'
        })
    );

    search.addWidget(
        instantsearch.widgets.hits({
            container: '#homeSearchHits',
            hitsPerPage: 10,
            templates: {
            item: '\
                <div class="row mb-3">\
                    <div class="col">\
                        <a href="/recipe/{{uuid}}">\
                            <div class="media">\
                                <img class="recipe-img mr-3" src="{{{photoURL}}}" alt="Recipe photo">\
                                <div class="media-body">\
                                    <h5>{{{name}}}</h5>\
                                    <p><i class="fa fa-pie-chart"></i> {{{servings}}}</p>\
                                    <p><i class="fa fa-user"></i> by {{{author}}}</p>\
                                </div>\
                            </div>\
                        </a>\
                    </div>\
                </div>',
            empty: "We didn't find any recipes for <em>\"{{query}}\"</em>"
            }
        })
    );

    search.start();
});
