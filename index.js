import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "1234",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
async function getItems(){
  const result = await db.query("SELECT * FROM items")
  let dbItems =[];
  dbItems = result.rows;
  console.log(dbItems)
  return dbItems;
}


let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {

    const dbItems = await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: dbItems,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  console.log (item);
  //items.push({ title: item });
  await db.query (
    `INSERT INTO items (title) VALUES ($1)`,[item]
  );
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const itemId = req.body.updatedItemId;
  const itemTitle =req.body.updatedItemTitle;
  console.log(itemId,itemTitle);

  await db.query (`UPDATE items SET title = $1  WHERE id = $2`, [itemTitle,itemId])
  res.redirect("/");

});

app.post("/delete", async  (req, res) => {
  const itemId = req.body.deleteItemId;
  console.log(itemId)
  await db.query(`DELETE FROM items WHERE id =$1`,[itemId] );
  res.redirect("/");

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
