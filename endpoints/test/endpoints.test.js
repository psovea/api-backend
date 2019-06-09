/* These are very basic unit tests, but it does provide a framwork we can build
 * upon further. We should extend these tests as soon as we start to use
 * the db-endpoints.
 */

var supertest = require('supertest')
var should = require('should')
var fs = require('fs')

/* Define the port where our server is running */
var server = supertest.agent('http://localhost:3000')

describe('STATIC DATA', () => {
  it('"/" should return empty JSON', (done) => {
    server.get('/')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        JSON.stringify(res.body).should.equal('{}')
        done()
      })
  })

  it('"/getStops" should return JSON with all stops', (done) => {
    server.get('/getStops')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.should.eql(JSON.parse(fs.readFileSync('../data/amsterdam_stops.json')))
        done()
      })
  })
})
