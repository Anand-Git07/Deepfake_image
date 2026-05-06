from __future__ import annotations

import importlib.util
from datetime import date, timedelta
from pathlib import Path

BASE = Path("/Users/raviraj/Documents/New project/report_build/build_covid_report_base.py")
spec = importlib.util.spec_from_file_location("base_report", BASE)
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

base.OUT = Path("/Users/raviraj/Documents/New project/Data_Analysis_of_Covid_19_Internship_Report_Disha_Mondal.docx")
base.STUDENT_NAME = "Disha Mondal"
base.TOPIC = "Data Analysis of Covid 19"


def add_company_certificate(doc):
    base.centered(doc, "CERTIFICATE OF INTERNSHIP", size=16, bold=True, after=24, before=20)
    base.paragraph(doc, f"{base.CERT_DATE}", align=base.WD_ALIGN_PARAGRAPH.RIGHT, after=18)
    base.paragraph(doc, "TO WHOM IT MAY CONCERN", size=14, bold=True, align=base.WD_ALIGN_PARAGRAPH.CENTER, after=18)
    paragraphs = [
        f"This is to certify that Ms. {base.STUDENT_NAME}, a student of {base.COLLEGE}, Bannerghatta Road, studying {base.COURSE}, {base.SEMESTER}, affiliated to {base.UNIVERSITY}, Bangalore, has successfully completed a one-month Internship Programme on {base.TOPIC} at {base.COMPANY} from {base.INTERNSHIP_START} to {base.INTERNSHIP_END} at our office premises, Bengaluru.",
        f"During the tenure of her Internship Programme with us, Ms. {base.STUDENT_NAME} demonstrated a commendable work ethic and was found to be hardworking, sincere, and punctual. She actively contributed to assigned COVID-19 data analysis activities and exhibited a keen willingness to learn data cleaning, trend analysis, visualisation, and interpretation of public-health datasets.",
        f"We wish Ms. {base.STUDENT_NAME} all the very best in her future academic and professional endeavours.",
    ]
    for text in paragraphs:
        base.paragraph(doc, text, after=10)
    base.paragraph(doc, "Yours faithfully,", after=16)
    base.paragraph(doc, f"For {base.COMPANY},", after=48)
    base.paragraph(doc, "Authorised Signatory", after=6)
    base.paragraph(doc, base.CERT_ISSUER, bold=True, after=10)
    base.paragraph(doc, f"This certificate is issued on behalf of {base.COMPANY} and is valid only with an authorised signature and company seal.", size=11, italic=True, after=0)
    base.page_break(doc)


def internship_day_rows():
    activities = [
        "Internship orientation, company introduction, and discussion of the COVID-19 data analysis project.",
        "Overview of pandemic datasets, public-health indicators, and responsible interpretation of health data.",
        "Study of COVID-19 variables such as confirmed cases, active cases, recovered cases, deaths, tests, and vaccination.",
        "Understanding dataset columns, date fields, state or country fields, and cumulative versus daily values.",
        "Data cleaning practice: checking duplicates, blanks, invalid dates, and inconsistent location names.",
        "Preparing derived fields such as daily new cases, recovery rate, death rate, and test positivity rate.",
        "Exploratory analysis of case trends across dates and comparison between selected regions.",
        "Creating summary tables for total confirmed cases, recoveries, deaths, and active cases.",
        "Learning moving averages and why they are useful for smoothing daily reporting fluctuations.",
        "Preparing line charts for daily cases, cumulative cases, recoveries, and deaths.",
        "Understanding growth rate, peak period, and wave-wise changes in COVID-19 spread.",
        "Analysing region-wise differences using bar charts and ranked tables.",
        "Studying the relation between testing volume, confirmed cases, and positivity rate.",
        "Preparing correlation analysis for cases, testing, deaths, recovery, and vaccination indicators.",
        "Introduction to forecasting concepts using trend lines and simple time-series interpretation.",
        "Creating dashboard-style summary pages for COVID-19 indicators.",
        "Preparing visual charts for cases, recoveries, deaths, vaccination, and testing.",
        "Understanding limitations caused by reporting delays, missing values, and data revisions.",
        "Writing methodology notes covering data collection, cleaning, EDA, trend analysis, and visualisation.",
        "Documenting formulas, assumptions, and interpretation rules used in the analysis.",
        "Testing whether charts and tables match cleaned dataset totals and calculated values.",
        "Preparing insight notes about COVID-19 waves, recovery pattern, and mortality indicators.",
        "Learning report export, figure placement, and presentation of public-health findings.",
        "Reviewing data privacy, anonymisation, file naming, and documentation standards.",
        "Drafting internship report chapters, literature survey notes, and project explanation.",
        "Preparing final report content, conclusion, and bibliography references.",
        "Final review of the analysis workflow, internship learning outcomes, and report checklist.",
        "Discussion of improvements such as real-time dashboards, district-level data, and predictive modelling.",
        "Completion of company-side formalities and collection of internship completion certificate.",
    ]
    d = date(2026, 3, 2)
    rows = []
    i = 0
    while d <= date(2026, 4, 3) and i < len(activities):
        if d.weekday() != 6:
            rows.append((str(i + 1), d.strftime("%d-%m-%Y"), activities[i]))
            i += 1
        d += timedelta(days=1)
    return rows


def add_acknowledgement(doc):
    base.centered(doc, "ACKNOWLEDGEMENT", size=16, bold=True, after=24, before=20)
    texts = [
        "Apart from my efforts, the source of this internship project depends largely on the encouragement and guidance of many others. I take this opportunity to express my sincere gratitude to everyone who supported me during the successful completion of this internship report.",
        f"I would like to express my sincere thanks to our beloved Principal {base.PRINCIPAL}, who has been a leading light of our institution and has encouraged students to develop practical professional skills along with academic learning.",
        f"I would like to acknowledge my gratitude to our Head of the Department, {base.HOD}, {base.DEPARTMENT}, for her encouragement and support. Her guidance helped me understand the value of discipline, documentation, and continuous learning during the internship.",
        f"I would like to express my heartfelt gratitude to my guide {base.GUIDE}, {base.GUIDE_TITLE}, {base.DEPARTMENT}, for his valuable suggestions and support throughout this work. His guidance helped me shape the topic of {base.TOPIC} into a clear and useful academic report.",
        f"I also thank {base.COMPANY} for providing me the opportunity to complete an internship in the area of COVID-19 data analysis. The exposure helped me understand how public-health datasets can be cleaned, analysed, visualised, and interpreted responsibly.",
        "Further, I would like to thank all professors of Computer Applications for their help and suggestions. I extend my special thanks to my parents and family members for their love and support.",
    ]
    for text in texts:
        base.paragraph(doc, text, after=8)
    base.paragraph(doc, f"Place: {base.PLACE}                                                                                                             {base.STUDENT_NAME.upper()}", after=2)
    base.paragraph(doc, f"({base.REGISTER_NO})", align=base.WD_ALIGN_PARAGRAPH.RIGHT, after=0)
    base.page_break(doc)


def add_abstract(doc):
    base.centered(doc, "ABSTRACT", size=16, bold=True, after=18, before=18)
    texts = [
        f"The internship project titled {base.TOPIC} presents a structured study of COVID-19 data using data cleaning, exploratory analysis, trend analysis, visualisation, and interpretation. The project focuses on important indicators such as confirmed cases, active cases, recovered cases, deaths, testing, positivity rate, recovery rate, case fatality rate, and vaccination progress.",
        "The project follows a complete analytics workflow that includes data collection, data preparation, missing-value handling, daily and cumulative calculation, region-wise comparison, time-series trend analysis, correlation study, and dashboard-style reporting. The main purpose is to understand how COVID-19 spread changed over time and how key indicators can be compared across regions.",
        "The report explains that COVID-19 analysis requires careful interpretation because public-health data can be affected by reporting delays, changes in testing policy, data revisions, and differences in population size. Therefore, the project uses rates, percentages, moving averages, and visual comparison instead of relying only on raw totals.",
        f"This internship at {base.COMPANY} helped me gain practical exposure to public-health data analysis and report preparation. The report is prepared as a complete academic record of the internship, following the required format and front matter structure.",
    ]
    for text in texts:
        base.paragraph(doc, text, after=8)
    base.page_break(doc)


def add_contents(doc):
    base.centered(doc, "TABLE OF CONTENTS", size=16, bold=True, after=18, before=12)
    entries = [
        ("1.", "INTRODUCTION", "1-4"),
        ("2.", "COMPANY PROFILE", "5-6"),
        ("3.", "LITERATURE SURVEY", "7-11"),
        ("4.", "REQUIREMENTS SPECIFICATIONS", "12-15"),
        ("5.", "DATA ANALYSIS METHODOLOGY", "16-21"),
        ("6.", "ANALYTICAL TOOL DESIGN", "22-27"),
        ("7.", "IMPLEMENTATION", "28-34"),
        ("8.", "ANALYSIS AND FINDINGS", "35-38"),
        ("9.", "SNAPSHOTS", "39-40"),
        ("10.", "INTERNSHIP LEARNING OUTCOMES", "41-42"),
        ("11.", "CONCLUSION", "43-44"),
        ("12.", "BIBLIOGRAPHY", "45"),
    ]
    table = doc.add_table(rows=1, cols=3)
    table.style = "Table Grid"
    base.fix_table(table, [0.65, 5.2, 0.9])
    for i, h in enumerate(["No.", "Chapter", "Page No."]):
        cell = table.rows[0].cells[i]
        base.set_cell_shading(cell, "D9EAF7")
        p = cell.paragraphs[0]
        p.alignment = base.WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        base.set_run_font(r, size=11, bold=True)
    for no, title, pages in entries:
        cells = table.add_row().cells
        for idx, value in enumerate([no, title, pages]):
            p = cells[idx].paragraphs[0]
            p.alignment = base.WD_ALIGN_PARAGRAPH.LEFT if idx == 1 else base.WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.line_spacing = 1.5
            r = p.add_run(value)
            base.set_run_font(r, size=11, bold=(idx == 1))
    base.fix_table(table, [0.65, 5.2, 0.9])
    base.page_break(doc)


def body_pages():
    return [
        ("INTRODUCTION", "1.1 Project Overview",
         ["Data Analysis of Covid 19 is a public-health analytics project that studies the pattern of COVID-19 cases, recoveries, deaths, testing, and vaccination indicators. The project uses structured datasets to understand how the pandemic changed over time and how different regions can be compared using meaningful measures.",
          "The main idea of this project is to convert raw COVID-19 records into useful information. Raw data may contain cumulative totals, daily updates, missing values, and region names. Through data cleaning and transformation, these records can be used to create trends, rates, charts, and dashboard summaries.",
          "The project is academic in nature and is not intended to provide medical advice. It demonstrates how data analysis can support understanding of public-health situations when interpreted carefully and responsibly."],
         ["To analyse confirmed cases, recoveries, deaths, testing, and vaccination indicators.", "To study daily trends, cumulative trends, and region-wise comparison.", "To prepare clear charts and findings from COVID-19 data."]),
        ("INTRODUCTION", "1.2 Need for COVID-19 Data Analysis",
         ["COVID-19 created a situation where governments, hospitals, researchers, and the public needed timely information. Data analysis became important because raw case reports alone were not enough to understand the direction of the pandemic.",
          "Daily cases, active cases, recovery rates, death rates, testing rates, and vaccination progress helped stakeholders monitor the spread and response. Visual reports made it easier to understand waves, peaks, and reductions over time.",
          "Data analysis also helps compare regions fairly. A large region may show more cases in raw numbers, but rates and percentages may provide a more meaningful view when population and testing differences are considered."],
         ["Supports public-health monitoring.", "Helps identify waves, peaks, and declining trends.", "Improves comparison through rates and percentages."]),
        ("INTRODUCTION", "1.3 Objectives of the Project",
         ["The primary objective is to clean and analyse COVID-19 data so that important trends can be understood. The project focuses on confirmed cases, recoveries, deaths, active cases, testing, vaccination, and derived indicators such as positivity rate and recovery rate.",
          "Another objective is to learn how to create clear visual summaries. Line charts, bar charts, moving averages, and dashboard-style pages can make public-health data easier to interpret.",
          "The project also aims to develop skill in responsible reporting. COVID-19 data must be interpreted carefully because numbers can be affected by testing policy, reporting delay, and data revision."],
         ["Prepare clean datasets from raw records.", "Calculate daily cases, active cases, recovery rate, and fatality rate.", "Compare regions and time periods.", "Prepare a complete internship report in the required format."]),
        ("INTRODUCTION", "1.4 Scope of the Project",
         ["The scope of the project includes data collection, data cleaning, transformation, exploratory data analysis, trend analysis, region-wise comparison, correlation analysis, and report preparation. It focuses on understanding the data rather than predicting exact future pandemic behaviour.",
          "The project can use country-wise, state-wise, or district-wise COVID-19 datasets depending on availability. The analysis may include cumulative cases, daily cases, deaths, recoveries, tests, vaccination doses, and positivity indicators.",
          "The scope also includes explaining limitations. COVID-19 data can be affected by reporting rules, testing availability, under-reporting, and changes in public-health definitions."],
         ["Daily and cumulative case analysis.", "Recovery, active-case, and death-rate calculation.", "Testing and positivity-rate study.", "Vaccination trend analysis.", "Dashboard-style reporting and insight writing."]),
        ("COMPANY PROFILE", "2.1 Host Organisation",
         [f"The internship was completed at {base.COMPANY}, Bengaluru, as certified in the internship completion document. The company provided the environment for learning and applying the project topic of {base.TOPIC}. The certificate confirms that the internship programme was conducted from {base.INTERNSHIP_START} to {base.INTERNSHIP_END}.",
          "The internship environment helped in understanding how data analysis projects are planned, documented, and presented. Even when working with sample public-health datasets, the analyst must follow a careful process because interpretation can influence how readers understand health-related information.",
          "During the internship, the focus was on learning the steps of public-health data analysis: data understanding, cleaning, derived calculations, exploratory analysis, trend study, visualisation, and report preparation."],
         ["Company Name: KSR Enterprises.", "Location: Bengaluru.", f"Internship Area: {base.TOPIC}.", "Duration: 2nd March 2026 to 3rd April 2026."]),
        ("COMPANY PROFILE", "2.2 Internship Role and Responsibilities",
         ["The internship role involved learning how to study a structured dataset and prepare a meaningful analytical report. The work began with understanding the dataset fields and continued with cleaning, transformation, visualisation, and interpretation.",
          "A key responsibility was to avoid unsupported conclusions. In public-health analytics, an analyst must clearly separate data observation from medical or policy advice. The project therefore presents findings as analytical observations.",
          "Another responsibility was to communicate results clearly through tables, charts, and explanation. The report must help readers understand why daily trends, recovery rates, death rates, and testing indicators are important."],
         ["Study dataset structure and variables.", "Clean missing, duplicate, and inconsistent records.", "Perform trend and region-wise analysis.", "Prepare documentation and internship report chapters."]),
        ("LITERATURE SURVEY", "3.1 Overview of COVID-19",
         ["COVID-19 is an infectious disease caused by the SARS-CoV-2 virus. The pandemic affected countries across the world and created a strong need for public-health data collection, monitoring, and reporting.",
          "Important indicators used during the pandemic include confirmed cases, active cases, recovered cases, deaths, tests conducted, positivity rate, hospitalisation, and vaccination coverage. These indicators help describe different aspects of the situation.",
          "Data analysis of COVID-19 became important because the situation changed quickly. Timely charts and reports helped people understand whether cases were rising, falling, or stabilising."],
         None),
        ("LITERATURE SURVEY", "3.2 COVID-19 Indicators",
         ["Confirmed cases show the number of people who tested positive. Active cases show the number of currently infected reported cases after subtracting recoveries and deaths from confirmed cases. Recovered cases show people who were reported to have recovered.",
          "Deaths are used to calculate case fatality rate, but this measure must be interpreted carefully because it depends on testing levels, reporting accuracy, age distribution, and healthcare capacity.",
          "Testing indicators are also important. A high positivity rate may suggest that many infections are being detected among those tested, while a low positivity rate may indicate broader testing coverage or reduced spread."],
         ["Confirmed cases.", "Active cases.", "Recoveries and recovery rate.", "Deaths and case fatality rate.", "Testing volume and positivity rate.", "Vaccination progress."]),
        ("LITERATURE SURVEY", "3.3 Trend Analysis",
         ["Trend analysis studies how values change over time. In COVID-19 data, trends can show the rise and fall of daily cases, the timing of waves, and the effect of changes in testing or public-health measures.",
          "Line charts are commonly used for trend analysis because they show movement across dates. Moving averages are useful because daily COVID-19 reporting can fluctuate due to weekends, holidays, and reporting delays.",
          "Trend analysis helps identify peak periods and compare one wave with another. It also helps understand whether recoveries are increasing and whether active cases are reducing."],
         None),
        ("LITERATURE SURVEY", "3.4 Region-Wise Analysis",
         ["Region-wise analysis compares COVID-19 indicators across countries, states, districts, or cities. It helps identify which regions experienced higher case counts, death rates, recovery rates, or testing rates.",
          "Raw totals can be misleading when regions have different population sizes. Therefore, percentage-based measures and per-population rates are useful when population data is available.",
          "Region-wise comparison also helps understand whether the pandemic spread evenly or whether certain locations were affected more severely during specific periods."],
         None),
        ("LITERATURE SURVEY", "3.5 Data Quality in COVID-19 Datasets",
         ["COVID-19 datasets can contain missing records, delayed reporting, duplicate updates, revised totals, and inconsistent region names. These issues can affect analysis if they are not handled carefully.",
          "Cumulative values may sometimes decrease because of corrections. Daily new values calculated from cumulative totals can therefore become negative if revisions occur. Such cases should be checked and documented.",
          "Good analysis requires clear cleaning rules, validation of totals, and honest explanation of limitations."],
         None),
        ("REQUIREMENTS SPECIFICATIONS", "4.1 Functional Requirements",
         ["The project must import a structured COVID-19 dataset, clean it, analyse it, and generate meaningful findings. The system should support daily and cumulative calculations, chart creation, region-wise comparison, and summary tables.",
          "The analysis should allow comparison of confirmed cases, active cases, recoveries, deaths, tests, positivity rate, recovery rate, and vaccination indicators.",
          "The final report should clearly explain the methods and findings so that a reader can understand the pandemic trend without needing to inspect the raw dataset."],
         ["Load dataset from CSV or Excel file.", "Clean missing, duplicate, and inconsistent records.", "Calculate daily and cumulative indicators.", "Generate trend charts and comparison tables.", "Prepare dashboard-style output and written findings."]),
        ("REQUIREMENTS SPECIFICATIONS", "4.2 Non-Functional Requirements",
         ["The analysis should be accurate, repeatable, readable, and responsible. Accuracy means that calculations should match the cleaned dataset. Repeatability means the same steps can be run again if the dataset changes.",
          "Readability is important because reports must be understood by academic evaluators and non-technical readers. Charts and tables should use clear labels, meaningful titles, and consistent formatting.",
          "Responsibility is especially important in public-health analytics. The report should not create fear or make unsupported medical claims."],
         ["Accuracy: validated totals and formulas.", "Usability: simple charts and clear interpretation.", "Maintainability: documented cleaning steps.", "Ethics: responsible handling and explanation of public-health data."]),
        ("REQUIREMENTS SPECIFICATIONS", "4.3 Hardware Requirements",
         ["The hardware requirements for this project are modest. A normal laptop can handle typical COVID-19 datasets because public datasets are usually stored in CSV or Excel format.",
          "More memory is helpful if district-level data, long date ranges, or dashboard tools are used. A stable system also supports smooth chart preparation, report writing, and presentation work.",
          "The following table summarises the recommended hardware configuration."],
         None,
         (["Component", "Recommended Specification"], [["Processor", "Intel Core i3 / AMD equivalent or higher"], ["RAM", "8 GB recommended"], ["Storage", "20 GB free disk space"], ["Display", "1366 x 768 minimum, Full HD recommended"], ["Network", "Broadband connection for references and data download"]], [2.0, 4.85])),
        ("REQUIREMENTS SPECIFICATIONS", "4.4 Software Requirements",
         ["The software requirements include tools for data cleaning, analysis, visualisation, and documentation. Python is suitable for COVID-19 analysis because it provides libraries such as pandas, NumPy, matplotlib, and seaborn.",
          "Excel or Power BI can also be used for summary tables and visual reporting. Word is used for report preparation, while PowerPoint can be used for presenting major findings.",
          "The following software configuration was considered for the project."],
         None,
         (["Software", "Purpose"], [["Python", "Data cleaning, trend analysis, correlation, and visualisation"], ["pandas and NumPy", "Data manipulation and numerical operations"], ["matplotlib and seaborn", "Charts, heatmaps, and visual analysis"], ["Microsoft Excel", "Initial review and summary tables"], ["Power BI or Tableau", "Optional dashboard design"], ["Microsoft Word", "Internship report preparation"]], [2.0, 4.85])),
        ("DATA ANALYSIS METHODOLOGY", "5.1 Analytics Lifecycle",
         ["The methodology begins with understanding the question: how did COVID-19 indicators change over time and across regions? After the question is defined, the dataset is collected, reviewed, cleaned, and transformed.",
          "Exploratory data analysis is then performed to understand totals, distributions, and trends. Derived indicators such as daily cases, recovery rate, fatality rate, and positivity rate are calculated.",
          "The final stage is interpretation. The project presents findings in charts, tables, and written explanation while clearly mentioning limitations."],
         ["Understand the question.", "Collect and validate data.", "Clean and transform records.", "Calculate derived indicators.", "Visualise trends and comparisons.", "Interpret and document findings."]),
        ("DATA ANALYSIS METHODOLOGY", "5.2 Data Collection",
         ["Data collection involves selecting a structured dataset containing COVID-19 indicators by date and region. Public datasets are useful for academic projects because they provide anonymised aggregated information.",
          "Before analysis, each column is reviewed to understand its meaning. The analyst identifies whether values are daily or cumulative and whether dates are recorded consistently.",
          "The collected data is preserved as a raw file, while cleaned and processed versions are stored separately for reproducibility."],
         None),
        ("DATA ANALYSIS METHODOLOGY", "5.3 Data Cleaning",
         ["Data cleaning removes errors that can mislead analysis. Missing values are identified, duplicate rows are checked, and inconsistent region names are standardised.",
          "Date fields are converted to a proper date format. Cumulative totals are checked for sudden drops or corrections. Negative daily values created by data revision are reviewed carefully.",
          "After cleaning, counts and summary totals are compared with the original dataset to confirm that valid records were not lost."],
         ["Remove duplicate records after verification.", "Handle missing values using appropriate method.", "Standardise location names.", "Convert date columns to proper date format.", "Preserve raw data separately from cleaned data."]),
        ("DATA ANALYSIS METHODOLOGY", "5.4 Derived Indicators",
         ["Derived indicators make COVID-19 data more meaningful. Daily new cases can be calculated from cumulative confirmed cases. Active cases can be calculated by subtracting recoveries and deaths from confirmed cases.",
          "Recovery rate is calculated as recovered cases divided by confirmed cases. Case fatality rate is calculated as deaths divided by confirmed cases. Positivity rate is calculated as confirmed cases divided by tests conducted.",
          "These rates help compare regions and time periods better than raw totals alone."],
         None),
        ("DATA ANALYSIS METHODOLOGY", "5.5 Trend Analysis Method",
         ["Trend analysis is performed by arranging records by date and plotting values across time. Daily new cases, cumulative cases, recoveries, and deaths are visualised using line charts.",
          "Moving averages are calculated to reduce noise in daily reporting. A seven-day moving average is commonly useful because it smooths weekly reporting fluctuations.",
          "Trend analysis helps identify waves, peak periods, and decline phases."],
         None),
        ("DATA ANALYSIS METHODOLOGY", "5.6 Correlation Method",
         ["Correlation analysis is used to study relationships among numerical indicators such as tests, confirmed cases, recoveries, deaths, vaccination doses, and positivity rate.",
          "A correlation matrix helps identify whether increases in one variable are associated with increases or decreases in another. For example, testing volume and confirmed cases may show a relationship because more testing can detect more cases.",
          "Correlation is interpreted carefully because it does not prove causation. It is used as an exploratory tool."],
         None),
        ("ANALYTICAL TOOL DESIGN", "6.1 Data Preparation Design",
         ["The data preparation design keeps the raw dataset unchanged and creates a cleaned version for analysis. This protects the original data and allows the analyst to repeat the workflow if needed.",
          "Columns are renamed with clear labels such as Date, Region, Confirmed, Recovered, Deaths, Tests, Vaccinated, Daily_Cases, Recovery_Rate, Fatality_Rate, and Positivity_Rate.",
          "A data dictionary is prepared to explain each field, its type, and its meaning."],
         None),
        ("ANALYTICAL TOOL DESIGN", "6.2 Indicator Design",
         ["Indicators are divided into raw indicators and derived indicators. Raw indicators come directly from the dataset, while derived indicators are calculated from available columns.",
          "Confirmed cases, recovered cases, deaths, tests, and vaccination doses are raw indicators when available. Daily cases, active cases, recovery rate, fatality rate, positivity rate, and moving average are derived indicators.",
          "Separating indicators by type helps keep the analysis transparent."],
         None,
         (["Indicator Type", "Examples"], [["Raw", "Confirmed, recovered, deaths, tests, vaccination"], ["Derived", "Daily cases, active cases, recovery rate"], ["Rate", "Fatality rate, positivity rate, vaccination coverage"], ["Trend", "Seven-day moving average and growth rate"]], [2.0, 4.85])),
        ("ANALYTICAL TOOL DESIGN", "6.3 Chart Design",
         ["The chart design uses line charts for trends, bar charts for region-wise comparison, and cards or summary tables for key totals. Each visual has a clear title and readable labels.",
          "Line charts are suitable for daily and cumulative values because they show movement across time. Bar charts are suitable for comparing regions or ranking highest-affected areas.",
          "Charts are designed to avoid clutter. Too many regions in one chart can make the output unreadable, so selected regions or top-ranked values are used."],
         None),
        ("ANALYTICAL TOOL DESIGN", "6.4 Dashboard Design",
         ["The dashboard design begins with key indicators at the top: total confirmed cases, total recoveries, total deaths, active cases, recovery rate, and fatality rate.",
          "The middle section contains trend charts for daily cases and cumulative cases. The lower section contains region-wise comparison and testing or vaccination indicators.",
          "Filters can be added for date range and region. This makes the dashboard interactive and helps users focus on a specific period or location."],
         None),
        ("ANALYTICAL TOOL DESIGN", "6.5 Correlation Output Design",
         ["The correlation output is designed as a matrix and heatmap. The matrix shows relationships among numerical indicators, while the heatmap makes the strength of relationships easier to identify visually.",
          "Correlation values are displayed with two decimal places so that the reader can compare them accurately. Strong positive and negative values are discussed in the findings section.",
          "The output is used to support interpretation, not to claim direct cause."],
         None),
        ("ANALYTICAL TOOL DESIGN", "6.6 Report Design",
         ["The final report design follows an academic structure with front pages, abstract, table of contents, chapters, findings, conclusion, and bibliography. The body text is justified with 1.5 line spacing.",
          "Tables are used only where repeated records or comparisons are useful. Charts and snapshot placeholders are included to show the practical output of analysis.",
          "The report explains both results and limitations so that the analysis remains balanced."],
         None),
        ("IMPLEMENTATION", "7.1 Importing Libraries and Data",
         ["The implementation begins by importing required Python libraries. pandas is used for data handling, NumPy for numerical operations, matplotlib and seaborn for visualisation.",
          "The dataset is loaded from a CSV or Excel file. After loading, the first few records, column names, data types, row count, and missing-value summary are checked.",
          "This first step confirms whether the file was loaded correctly and whether important fields are available."],
         None,
         None,
         """import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv("covid19_data.csv")
print(df.head())
print(df.info())"""),
        ("IMPLEMENTATION", "7.2 Cleaning the Dataset",
         ["Cleaning includes removing duplicates, correcting date types, handling missing values, and reviewing abnormal records. For region fields, labels are standardised so that the same location is not counted separately.",
          "Missing numerical values may be filled with zero only when it is logically correct. Otherwise, they are left blank or handled using a documented method.",
          "Data revisions are checked carefully because cumulative totals may sometimes decrease due to correction."],
         None),
        ("IMPLEMENTATION", "7.3 Calculating Indicators",
         ["Derived indicators are calculated after cleaning. Daily cases are calculated from cumulative confirmed cases. Active cases are calculated using confirmed, recovered, and death counts.",
          "Recovery rate, case fatality rate, and positivity rate are calculated as percentages. These values make the report more meaningful than raw totals alone.",
          "The calculated fields are validated by checking sample rows and total summaries."],
         None,
         None,
         """df["Daily_Cases"] = df.groupby("Region")["Confirmed"].diff().fillna(0)
df["Active_Cases"] = df["Confirmed"] - df["Recovered"] - df["Deaths"]
df["Recovery_Rate"] = (df["Recovered"] / df["Confirmed"]) * 100
df["Fatality_Rate"] = (df["Deaths"] / df["Confirmed"]) * 100
df["Positivity_Rate"] = (df["Confirmed"] / df["Tests"]) * 100"""),
        ("IMPLEMENTATION", "7.4 Trend Visualisation",
         ["Trend visualisation is created using line charts. Daily cases and cumulative confirmed cases are plotted across dates to understand the direction of the pandemic.",
          "A moving average is added to smooth fluctuations. This helps identify the overall direction even when daily reporting is irregular.",
          "Separate charts may be created for recoveries, deaths, testing, and vaccination."],
         None,
         None,
         """daily = df.groupby("Date")["Daily_Cases"].sum().reset_index()
daily["MA_7"] = daily["Daily_Cases"].rolling(7).mean()

plt.plot(daily["Date"], daily["Daily_Cases"], label="Daily Cases")
plt.plot(daily["Date"], daily["MA_7"], label="7-Day Moving Average")
plt.title("COVID-19 Daily Cases Trend")
plt.legend()
plt.show()"""),
        ("IMPLEMENTATION", "7.5 Region-Wise Comparison",
         ["Region-wise comparison is prepared by grouping data by region and calculating final totals. This helps identify locations with higher confirmed cases, recoveries, deaths, or active cases.",
          "Bar charts are used to rank top regions. If population data is available, per-lakh or per-million rates can be calculated for fairer comparison.",
          "The report explains that raw totals should be interpreted with caution because regions may differ in population and testing levels."],
         None),
        ("IMPLEMENTATION", "7.6 Correlation Analysis",
         ["Correlation analysis is performed on numerical indicators such as confirmed cases, tests, recoveries, deaths, vaccination, positivity rate, and fatality rate.",
          "The correlation heatmap helps identify which indicators move together. For example, confirmed cases and recoveries may show a strong relationship because recoveries are linked to previous infections.",
          "The results are interpreted carefully and used as supporting evidence in the findings section."],
         None,
         None,
         """numeric_df = df.select_dtypes(include=["int64", "float64"])
corr = numeric_df.corr()

plt.figure(figsize=(10, 8))
sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Correlation Matrix of COVID-19 Indicators")
plt.show()"""),
        ("IMPLEMENTATION", "7.7 Dashboard Preparation",
         ["Dashboard preparation includes selecting key indicators, arranging visuals, and writing insight notes. The dashboard should show total confirmed cases, recoveries, deaths, active cases, recovery rate, and fatality rate.",
          "Trend charts are placed near the top or middle so that the reader can quickly understand the movement over time. Region-wise comparisons and testing indicators are placed below.",
          "The dashboard is reviewed to ensure that labels are readable, values are correct, and charts do not overlap."],
         None),
        ("ANALYSIS AND FINDINGS", "8.1 Trend Findings",
         ["Trend analysis shows how COVID-19 cases changed over time. Daily case charts can reveal waves, peak periods, and decline phases. Moving averages make these patterns easier to interpret by reducing daily noise.",
          "Cumulative case charts usually increase over time, while active cases may rise and fall depending on recovery and death counts. These patterns help explain the progress of the pandemic.",
          "The findings should be interpreted with awareness of reporting delays and testing changes."],
         None),
        ("ANALYSIS AND FINDINGS", "8.2 Region-Wise Findings",
         ["Region-wise analysis identifies which locations reported higher confirmed cases, recoveries, deaths, or active cases. A ranked chart helps compare regions quickly.",
          "However, raw totals do not always show severity because larger regions may naturally report more cases. Where possible, rate-based indicators should be used.",
          "The report therefore combines raw totals with recovery rate, fatality rate, and positivity rate to create a balanced interpretation."],
         None),
        ("ANALYSIS AND FINDINGS", "8.3 Testing and Positivity Findings",
         ["Testing volume affects confirmed case counts. If testing increases, more infections may be detected. Positivity rate helps understand the share of positive results among tests conducted.",
          "A high positivity rate may indicate that infections are widespread or that testing is focused mainly on symptomatic people. A lower positivity rate may suggest broader testing or reduced spread.",
          "The project uses testing and positivity indicators to support interpretation of case trends."],
         None),
        ("ANALYSIS AND FINDINGS", "8.4 Recovery and Fatality Findings",
         ["Recovery rate and fatality rate provide additional understanding beyond confirmed case totals. Recovery rate shows the proportion of confirmed cases reported as recovered, while fatality rate shows deaths as a proportion of confirmed cases.",
          "These rates can change over time due to healthcare response, reporting practices, patient age distribution, and data updates. They should therefore be compared carefully.",
          "The project highlights these indicators because they help explain the outcome side of COVID-19 data."],
         None),
        ("SNAPSHOTS", "9.1 Data Cleaning and EDA Screens",
         ["The following snapshot descriptions represent the main working screens used during the project. The data cleaning screen shows missing-value checks, duplicate checks, and corrected date fields. The exploratory analysis screen shows case counts, recovery counts, death counts, and region summaries.",
          "These screens demonstrate that the project followed an organised workflow before creating final charts. Cleaning and EDA are important because public-health findings depend on the quality of input data.",
          "Snapshot placeholders are included so actual screenshots can be inserted if required by the college or guide."],
         None,
         (["Snapshot", "Description"], [["Dataset Preview", "First records and column structure"], ["Missing Value Check", "Blank fields and invalid records"], ["EDA Charts", "Cases, recoveries, deaths, and active-case summaries"]], [2.2, 4.65])),
        ("SNAPSHOTS", "9.2 Trend and Dashboard Screens",
         ["The trend screen contains line charts for daily cases, cumulative cases, recoveries, and deaths. The dashboard screen contains summary cards and region-wise comparison charts.",
          "These outputs directly support the core idea of the project: understanding COVID-19 patterns through cleaned data and visual analysis.",
          "The screenshots also help evaluators see the practical output of the analysis rather than only reading theoretical explanation."],
         None,
         (["Output", "Purpose"], [["Daily Trend Chart", "Shows rise, peak, and decline of reported cases"], ["Correlation Heatmap", "Shows relationships among numerical indicators"], ["Dashboard Summary", "Shows key COVID-19 indicators in one view"]], [2.2, 4.65])),
        ("INTERNSHIP LEARNING OUTCOMES", "10.1 Technical Learning",
         ["The internship improved my understanding of public-health data analysis. I learned how to clean structured data, calculate daily indicators, analyse trends, create charts, and interpret COVID-19 metrics.",
          "I also learned the importance of derived indicators such as recovery rate, fatality rate, positivity rate, and moving average. These indicators provide more meaning than raw totals alone.",
          "Another important learning outcome was the need for responsible interpretation. COVID-19 findings must be explained carefully and should not be presented as medical advice."],
         ["Data cleaning and preprocessing.", "Trend analysis and moving averages.", "Region-wise comparison.", "Correlation matrix and heatmap.", "Dashboard-style reporting."]),
        ("INTERNSHIP LEARNING OUTCOMES", "10.2 Professional Learning",
         ["The internship developed professional qualities such as attention to detail, patience, documentation, and willingness to learn. Public-health analytics requires careful checking because small mistakes can lead to misleading conclusions.",
          "I learned that technical outputs must be understandable to others. A chart becomes useful only when it is explained in simple language with proper context.",
          "The internship helped me connect classroom learning with a practical data-analysis problem and strengthened my confidence in preparing analytical reports."],
         None),
        ("CONCLUSION", "11.1 Conclusion",
         [f"The internship project on {base.TOPIC} successfully demonstrates how COVID-19 data can be studied using data cleaning, derived indicators, trend analysis, region-wise comparison, correlation analysis, and visual reporting.",
          "The most important learning from the project is that public-health data should be interpreted through multiple indicators. Confirmed cases, active cases, recoveries, deaths, testing, positivity rate, and vaccination data together provide a better view than any single number.",
          f"This internship at {base.COMPANY} provided practical exposure to public-health analytics and improved my ability to prepare professional reports. The knowledge gained through this work will be useful for future academic projects and professional opportunities in data analytics."],
         None),
        ("CONCLUSION", "11.2 Future Enhancements",
         ["The project can be improved by using district-level data, population-adjusted rates, and longer time periods. This would make region-wise comparison more meaningful.",
          "Advanced work can include forecasting models, interactive dashboards, vaccination-effect analysis, and comparison between waves. More reliable conclusions can also be made if data is validated against official sources.",
          "Future work can include a real-time dashboard that automatically updates when new public-health data is released."],
         ["Use district-level and population-adjusted data.", "Add forecasting and wave comparison.", "Include vaccination coverage analysis.", "Build an interactive real-time dashboard.", "Document data-source limitations more deeply."]),
        ("BIBLIOGRAPHY", "12.1 References",
         ["World Health Organization. COVID-19 public-health resources and pandemic information.",
          "Centers for Disease Control and Prevention. COVID-19 data, prevention, and public-health resources.",
          "Our World in Data. COVID-19 dataset and data documentation.",
          "Ministry of Health and Family Welfare, Government of India. COVID-19 dashboard and public updates.",
          "Johns Hopkins University Center for Systems Science and Engineering. COVID-19 data repository.",
          "pandas documentation. Data manipulation and analysis reference.",
          "NumPy documentation. Numerical computing reference.",
          "seaborn documentation. Statistical data visualisation reference.",
          "matplotlib documentation. Python plotting library reference.",
          f"Internship completion certificate issued for {base.STUDENT_NAME} by {base.COMPANY} / {base.CERT_ISSUER}, dated {base.CERT_DATE}."],
         None),
    ]


base.add_company_certificate = add_company_certificate
base.internship_day_rows = internship_day_rows
base.add_acknowledgement = add_acknowledgement
base.add_abstract = add_abstract
base.add_contents = add_contents
base.body_pages = body_pages
base.add_body = lambda doc: [base.add_chapter_page(doc, *spec) for spec in body_pages()]

if __name__ == "__main__":
    base.main()
