const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe('Testing del ecommerce',()=>{
    describe('test de productos',()=>{
        let prodId
        let authCookie
        before(async () => {
            const authResponse = await requester.post('/api/session/login').send({
                email: 'userTest@usertest.com',
                password: 'test123456'
            });
            authCookie = authResponse.headers['set-cookie'][0]
        })
        it('el endpoint GET /api/productos/ debe traer todo los productos',async ()=>{
            const response = await requester.get('/api/productos')
            expect(response).to.be.ok
            expect(response.statusCode).to.be.equal(200)
            expect(response.body).to.have.property('payload').that.is.an('object')
            expect(response.body.payload).to.have.property('docs').that.is.an('array').that.is.not.empty
        })
/*
        it('el endpoint POST /api/productos/ debe crear un producto correctamente',async ()=>{
            const productMock = {
                title: 'productoSuperTest4444',
                description: 'producto de prueba Supertest', 
                price: 123, 
                code: 'pssydssy1234444', 
                stock: 123, 
                category: 'producto de prueba Supertest'
            }
            const response = await requester.post('/api/productos').set('Cookie',[authCookie]).send(productMock)
            console.log(response.statusCode)
            console.log(response.ok)
            
            expect(response.body).to.have.property('payload')
            
        })
        */
              /*   

          

         it('el endpoint GET /api/productos/:pid debe traer un producto por su id',async ()=>{
            let pid = '64d13706e2a58879d41d63bf'
            const response = await requester.get(`/api/productos/${pid}`)
            console.log(response.body)
            expect(response).to.be.ok
            expect(response.statusCode).to.be.equal(200)
            expect(response.body).to.have.property('status').that.is.equal('success')
            expect(response.body).to.have.property('payload').that.is.an('object')
            expect(response.body.payload).to.have.property('_id')
        }) 
*/
     /*    it('El endpoint PUT /api/productos/:pid debe actualizar un producto correctamente', async () => {
            let pid = '64d13706e2a58879d41d63bf'
            const updatedProductMock = {
                code: 'eaea123',
                price: 120024,
                stock: 2324,
                category: 'productosupersupertest'
            };
            const response = await requester.put(`/api/productos/${pid}`).send(updatedProductMock)
            expect(response).to.be.ok
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.have.property('status').that.is.equal('success')
            expect(response.body).to.have.property('payload').that.is.an('object')
            expect(response.body.payload.code).to.equal(updatedProductMock.code)
            expect(response.body.payload.price).to.equal(updatedProductMock.price)
            expect(response.body.payload.category).to.equal(updatedProductMock.category)
        }) */

      /*  it('El endpoint DELETE /api/productos/:pid debe eliminar un producto correctamente', async () => {
            let pid = '64d13706e2a58879d41d63bf'
            const response = await requester.delete(`/api/productos/${pid}`)
            

             expect(response.statusCode).to.equal(200);
            expect(response.body).to.have.property('payload');
            expect(response.body.payload).to.have.property('_id');
             
        })

*/
    })

     describe('test de session', ()=>{
        let cookie
        let userId
        let userRole
        let userEmail
/*
         it('debe registrar u usuario correctamente ', async()=>{
            const userMock = {
                username: 'userTest1',
                first_name:'Usertest1',
                last_name: 'userTest1',
                email: 'userTest1@usertest.com',
                date_of_birth: new Date(),
                password: 'test123456'
            }
            const response = await requester.post('/api/session/register').send(userMock)
            console.log(response)
            expect(response.statusCode).to.be.equal(201)
            expect(response).to.be.ok
            expect(response.body).to.have.property('status').that.is.equal('success')
            expect(response.body).to.have.property('payload')
            expect(response._body.payload).to.have.property('_id')

            userId = response.body.payload._id
            userRole = response.body.payload.role
            userEmail = response.body.payload.email
        }) 

*/
         it('el servicio debe logear un usuario correctamente y devuelve una cookie', async()=>{
            const userMock = {
                email: 'test3@gmail.com',
                password: 'test31533'
            }
            const response = await requester.post('/api/session/login').send(userMock)
            const cookieResult = response.headers['set-cookie'][0]
            console.log(cookieResult)
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            }
            expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
            expect(cookie.value).to.be.ok
        }) 

        it('debe enviar el jwt del usuario y devolver los datos', async()=>{
            
            const response =await requester.get('/api/session/current').set('Cookie',[`${cookie.name}=${cookie.value}`])
            userEmail = response.body.payload.email
            expect(response).to.be.ok
            expect(response.statusCode).to.be.equal(200)
            expect(response.body).to.have.property('status').that.is.equal('success')
            expect(response.body.payload).to.have.property('email').that.is.equal(userEmail)
            expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
            expect(cookie.value).to.be.ok
            
        })
       /*
        it('debe cambiar el role del usuario de user a premium y viceversa', async()=>{
            const response =await requester.get(`/api/session/premium/${userId}`)
            expect(response).to.be.ok
            expect(response.statusCode).to.be.equal(200)
            expect(response.body).to.have.property('status').that.is.equal('success')
            expect(response.body).to.have.property('role')
            expect(response.body.role).to.not.equal(userRole)
        })
    */

        it('debe eliminar la sesión, destruir la cookie y redireccionar a /login', async()=>{
            const response = await requester.get('/api/session/logout').set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(response).to.be.ok
            expect(response.statusCode).to.be.equal(302)
            expect(response.headers['location']).to.be.equal('/login')
            const setCookieHeader = response.headers['set-cookie'];
            expect(setCookieHeader).to.be.an('array');
            expect(setCookieHeader).to.have.lengthOf(1);
            expect(setCookieHeader[0]).to.include(`${cookie.name}=;`);
        })


        
    })
})