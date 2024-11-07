const express = require('express');
const app = express();
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const supabase = createClient('https://btqdyetokeavrqywswds.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cWR5ZXRva2VhdnJxeXdzd2RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDk4MDgzMSwiZXhwIjoyMDQ2NTU2ODMxfQ.Hv6NJoFpwyp6k4eRqTVBeRq1cUhcR__sNjnFz3Utghw');
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

app.get('/', async (req, res) => {
  const { data, error } = await supabase
  .from('quotes')
  .select();
  if (error) {
    console.error('Error fetching quotes:', error);
    return res.status(500).send('Error fetching quotes');
  }
  res.render('index.ejs', { quotes: data });
})

app.post('/quotes', async (req, res) => {
  const { name, quote } = req.body;

  // Validate incoming data
  if (!name || !quote) {
    return res.status(400).send('Name and quote are required');
  }

  // Insert data into the quotes table
  const { data, error } = await supabase
    .from('quotes')
    .insert([{ name, quote }]); // Insert the name and quote only, without id

  // Handle potential errors
  if (error) {
    console.error('Error inserting quote:', error);
    return res.status(500).send('Error inserting quote');
  }

  res.status(201).redirect('/');
})

app.put('/quotes', async (req, res) => {
  // Step 1: Fetch the first row where name is "Yoda"
  const { data: yodaQuote, error: fetchError } = await supabase
  .from('quotes')
  .select()
  .eq('name', 'yoda')
  .single();

  if (fetchError) {
    console.error('Error fetching quote:', fetchError);
  } else if (yodaQuote) {
  // Step 2: Update the fetched row with Darth Vader's details
    const { data: updatedData, error: updateError } = await supabase
      .from('quotes')
      .update({ name: 'darth vader', quote: 'I find your lack of faith disturbing.' })
      .eq('id', yodaQuote.id);  // Using the unique ID of the fetched row

    if (updateError) {
      console.error('Error updating quote:', updateError);
    } else {
      console.log('Updated quote:', updatedData);
    }
  }

  res.status(201).redirect('/');
})

app.delete('/quotes', async (req, res) => {
  // Fetch the first "Darth Vader" quote
  const { data: darthQuote, error: fetchError } = await supabase
    .from('quotes')
    .select('id')
    .eq('name', 'darth vader')
    .limit(1);  // Fetch only the first matching record

  if (fetchError) {
    console.error('Error fetching quote:', fetchError);
    return res.status(500).json({ error: 'Error fetching quote' });
  }

  // If no "Darth Vader" quote is found
  if (!darthQuote || darthQuote.length === 0) {
    console.log('No Darth Vader quote to delete');
    return res.status(200).json({ message: 'No quote to delete' });
  }

  // Delete the specific "Darth Vader" quote by ID
  const { error: deleteError } = await supabase
    .from('quotes')
    .delete()
    .eq('id', darthQuote[0].id);  // Delete by ID

  if (deleteError) {
    console.error('Error deleting quote:', deleteError);
    return res.status(500).json({ error: 'Error deleting quote' });
  }

  // Send a success message
  res.status(200).json({ message: 'Darth Vader quote deleted successfully' });
});


app.listen(port, () => {
  console.log(`listening on port ${port}!`);
})
