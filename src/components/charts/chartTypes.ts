// Define the types for the input and output.
interface AttendanceObject {
	display_name: string;
	poll_id: string;
	season_id: string;
	title: string;
	winning_movie_id: string;
}

interface Dataset {
	label: string;
	data: number[];
}

interface ChartDataObject {
	labels: string[];
	datasets: Dataset[];
}

/**
 * Takes in a DB object returned by the `get_all_attendance` view.
 * Ensure all fields in the response are strings
 * @param entry Entry object from get_all_attendance view response
 * @return AttendanceObject DB response with no null fields or throws an error.
 */
function validateEntry(
	entry: {
		display_name: string | null;
		poll_id: string | null;
		season_id: string | null;
		title: string | null;
		winning_movie_id: string | null;
	}
): AttendanceObject {
	if (
		entry.display_name === null ||
		entry.poll_id === null ||
		entry.season_id === null ||
		entry.title === null ||
		entry.winning_movie_id === null
	) {
		throw new Error(
			`Unexpected null field in entry: ${JSON.stringify(entry)}`
		);
	}
	return entry as AttendanceObject;
}

export type {AttendanceObject, ChartDataObject}
export {validateEntry}