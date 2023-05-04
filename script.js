let movieDataURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"

let movieData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawTreeMap = () => {
    let hierarchy = d3.hierarchy(movieData, (node) => {
        return node['children']
    }).sum((node) => {
        return node['value']
    }).sort((node1, node2) => {
        return node2['value'] - node1['value'] // make sure that higher value comes before the lower value 
    })

    // create a method
    let createTreeMap = d3.treemap()
                            .size([1000, 600])

    createTreeMap(hierarchy)

    console.log(movieData['children']) // this shows the 7 categories of movies

    let movieTiles = hierarchy.leaves()
    console.log(movieTiles) // this shows the 95 top movies

    let block = canvas.selectAll('g')
                        .data(movieTiles)
                        .enter()
                        .append('g')
                        .attr('transform', (movie) => {
                            return 'translate(' + movie['x0'] + ', ' + movie['y0'] + ')'
                        })

    block.append('rect')
            .attr('class', 'tile')
            .attr('fill', (movie) => {
                let category = movie['data']['category']
                if (category === 'Action') {
                    return 'Orange'
                } else if (category === "Drama") {
                    return 'Red'
                } else if (category === "Adventure") {
                    return "LightGreen"
                } else if (category === "Family") {
                    return "LightBlue"
                } else if (category === "Animation") {
                    return "Pink"
                } else if (category === "Comedy") {
                    return "Yellow"
                } else if (category === "Biography") {
                    return "Brown"
                }
            })
            .attr('data-name', (movie) => {
                return movie['data']['name']
            })
            .attr('data-category', (movie) => {
                return movie['data']['category']
            })
            .attr('data-value', (movie) => {
                return movie['data']['value']
            })
            .attr('width', (movie) => {
                return movie['x1'] - movie['x0']
            })
            .attr('height', (movie) => {
                return movie['y1'] - movie['y0']
            })

            .on('mouseover', (movie) => {
                tooltip.transition()
                        .style('visibility', 'visible')
                
                let revenue = movie['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

                tooltip.html(
                    '$ ' + revenue + '<hr />' + movie['data']['name']
                )
                
                tooltip.attr('data-value', movie['data']['value'])
            })

            .on('mouseout', (movie) => {
                tooltip.transition()
                        .style('visibility', 'hidden')
            })

    block.append('text')
            .text((movie) => {
                return movie['data']['name']
            })
            .attr('x', 5)
            .attr('y', 20)
}

d3.json(movieDataURL).then(
    (data, error) => {
        if (error) {
            console.log(error)
        } else {
            movieData = data
            console.log(movieData) // this is the dataset that's converted in JS
            drawTreeMap()
        }
    }
)