import { useState } from 'react';
import axios from 'axios';

import { Container, Typography, Box, TextField, FormControl, InputLabel, Select ,MenuItem, Button, CircularProgress} from '@mui/material';
function App() {
    const [emailContent, setEmailContent] = useState('');
    const [tone, setTone] = useState('');
    const [generatedReply, setGeneratedReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
      setLoading(true);
      setError('');
      try{
        const response = await axios.post('http://localhost:8080/api/email/generate', {
          emailContent,
          tone
        });
        setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
      }
      catch(error){
        setError('Failed to generate reply. Please try again.');
        console.error(error);
      }
      finally {
        setLoading(false);
      }
    };

  return (
      <>
      <Container maxWidth="md" sx={{py:4}}>
            <Typography variant="h3" component="h1" gutterBottom>
              Email Assistance
            </Typography>
            <Box sx={{mx:3}}>
              <TextField fullWidth multiline rows={6} variant="outlined" label="Original Email Content" value={emailContent || ''} onChange={(e) => setEmailContent(e.target.value)} sx={{mb:2}} />
              
              <FormControl fullWidth sx={{mb:2}}>
                <InputLabel>Tone (Optional)</InputLabel>
                <Select
                  value={tone || ''}
                  label={"Tone (Optional)"}
                  onChange={(e) => setTone(e.target.value)}>
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="informal">Informal</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                </Select>
              </FormControl>

              <Button variant="contained" onClick={handleSubmit} disabled={!emailContent ||loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
              </Button>

            </Box>

            {
              error && (
                <Typography color="error" sx={{mb:2}}>
                  {error}
                </Typography>
              )
            }

            {
              generatedReply && (
                <Box sx={{mt:3}}>
                  <Typography variant="h6" gutterBottom>
                    Generated Reply:
                  </Typography>
                  <TextField fullWidth multiline rows={6} variant='outlined' value={generatedReply || ''} inputProps={{ readOnly: true }} />
                  <Button variant='outlined' sx={{mt:2}} onClick={() => {navigator.clipboard.writeText(generatedReply)}}>
                    Copy to Clipboard
                  </Button>
                </Box>
              )
            }
          </Container>
      </>

  )
}

export default App


// normal version
// import { useState } from 'react';
// import axios from 'axios';
// import './App.css'; // Import CSS file

// function App() {
//   const [emailContent, setEmailContent] = useState('');
//   const [tone, setTone] = useState('');
//   const [generatedReply, setGeneratedReply] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axios.post('http://localhost:8080/api/email/generate', {
//         emailContent,
//         tone
//       });
//       setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
//     } catch (err) {
//       setError('Failed to generate reply. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h1 className="title">Email Assistance</h1>

//       <textarea
//         placeholder="Original Email Content"
//         value={emailContent}
//         onChange={(e) => setEmailContent(e.target.value)}
//         className="textarea"
//       />

//       <select
//         value={tone}
//         onChange={(e) => setTone(e.target.value)}
//         className="select"
//       >
//         <option value="">None</option>
//         <option value="formal">Formal</option>
//         <option value="informal">Informal</option>
//         <option value="friendly">Friendly</option>
//         <option value="casual">Casual</option>
//         <option value="professional">Professional</option>
//       </select>

//       <button
//         onClick={handleSubmit}
//         disabled={!emailContent || loading}
//         className={`btn ${loading ? 'btn-loading' : ''}`}
//       >
//         {loading ? 'Generating...' : 'Generate Reply'}
//       </button>

//       {error && <p className="error">{error}</p>}

//       {generatedReply && (
//         <div className="reply-container">
//           <h3 className="subtitle">Generated Reply:</h3>
//           <textarea
//             readOnly
//             value={generatedReply}
//             className="textarea"
//           />
//           <button
//             onClick={() => navigator.clipboard.writeText(generatedReply)}
//             className="btn btn-outline"
//           >
//             Copy to Clipboard
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
