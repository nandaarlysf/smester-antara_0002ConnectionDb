const express=require('express')
const app=express()
const port=3001
const db=require('./models');
app.use(express.json());
app.use(express.urlencoded({                
    extended: false
}));

db.sequelize.sync().then(()=>{
    app.listen(3001,()=>{
        console.log('Server is running on port 3001');
    });
})
.catch((err)=>{
    console.error("Unable to connect to the database:",err);
})    

app.post('/komik',async(req,res)=>{
    const data=req.body;
    try{
        const komik=await db.Komik.create(data);
        res.send(komik);
    }catch(err){
        res.send(err);
    }
});

app.get('/komik',async(req,res)=>{
    try{
        const komik=await db.Komik.findAll();
        res.send(komik);
    }catch(err){
        res.send(err);    
    }
});

app.put('/komik/:id',async(req,res)=>{
    const id=req.params.id;
    const data=req.body;

    try{
        const komik=await db.Komik.findByPk(id);
        if(!komik){
            return res.status(404).send({message:'komik tidak ditemukan '})
        }

        await komik.update(data);
        res.send({message:'komik berhasil diupdate',komik});
    }catch(err){
        res.status(500).send(err);
    }
});
app.delete('/komik/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ message: 'Komik tidak ditemukan' });
        }

        await komik.destroy();
        res.send({ message: 'Komik berhasil dihapus' });
    } catch (err) {
        res.status(500).send(err);
    }
});