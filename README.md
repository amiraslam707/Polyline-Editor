🎨 Polyline Editor: An HCI Interaction Design Study
University of Karachi | HCI-CG Lab Exercise Student Name: [Your Name Here] | Seat No: [Your Seat Number]
Course Text: Human-Computer Interaction by Alan Dix (3rd Ed.)
________________________________________



📖 Overview
This project is a functional Polyline Editor built to demonstrate the core phases of the Interaction Design Process (Figure 5.1). The application allows users to create, modify, and manage complex shapes using precise coordinate-based interactions.
🛠 Tech Stack
•	Frontend: HTML5 Canvas & Vanilla JavaScript (Logic-first approach).
•	Data Handling: JSON & Blob API (Serverless file persistence).
•	Version Control: Git & GitHub.
________________________________________



🔄 The Design Process (Mapping to Figure 5.1)
1. Requirements (What is Wanted)
Based on the lab scenarios, the system must support five primary interaction verbs:
•	[B]egin: Initialization of a new data structure.
•	[D]elete: Targeted removal of vertices.
•	[M]ove: Dynamic vertex translation.
•	[R]efresh: State synchronization and rendering.
•	[Q]uit: Session termination and final data export.


2. Analysis & Task Analysis
We analyzed the user's mental model for drawing. Users expect "Magnetic" selection—where the tool "snaps" to the nearest point.
•	Scenario: A user wants to refine a "House" drawing.

•	Path: Select 'M' mode -> Hover near vertex -> Drag to new location -> Release.
3. Design Principles & Guidelines
To improve the user experience, we implemented two key HCI heuristics:
•	Error Prevention/Recovery: A stack-based Undo/Redo system allows users to explore designs without the cost of permanent errors.
•	Visibility of System Status: A dynamic status bar provides immediate feedback on which "Mode" the editor is currently in.
________________________________________




🚀 Advanced Technical Extensions
To exceed the minimum requirements, the following features were engineered:
A. Point-to-Segment Insertion [Extension]
Instead of just adding points at the end, users can press 'I' to insert a point between two existing vertices. This uses a projection-based distance algorithm to find the closest line segment.
B. Deep-Copy History Stack
Implemented an Undo/Redo mechanism using History Buffers. Every state change is stored as a deep-copy of the polyline array, preventing reference-sharing bugs.
C. Precision Coordinate Mapping
Utilized getBoundingClientRect() to solve the common "Canvas Offset" issue, ensuring the cursor tip aligns perfectly with the rendered pixel regardless of screen scaling.
________________________________________




📊 Technical Specifications
The system handles geometric selection using the Euclidean Distance Formula:

d = sqrt {(x_2 - x_1)^2 + (y_2 - y_1)^2}

For segment insertion, we utilize Linear Projection to find the perpendicular distance from the mouse to the line segment    V ----> W.

________________________________________



⚠️ Challenges & Confusions
•	Challenge 1: State Management. Initially, pushing the allPolylines array into history only stored a reference. Any change to the current drawing changed the history too. Solution: Implemented JSON.parse(JSON.stringify(data)) to create immutable snapshots.
•	Challenge 2: Hit Detection. Finding the "closest" point in a dense drawing. Solution: Implemented a distance threshold (12px) to provide a "forgiving" hit-box for the user's mouse.
•	Confusion: The lab document asked for a "Quit" and "Save to File" mechanism. Solution: We integrated the Blob API to allow local JSON downloads, fulfilling the "save to file" requirement without a backend server.
________________________________________




🎮 How to Run
1.	Clone the repository: git clone [Your-Repo-Link]
2.	Open index.html in any modern browser.
3.	Use the keyboard shortcuts displayed in the header to interact with the canvas.

