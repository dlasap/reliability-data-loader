import "../styles/CSVTable.css";
import { CsvToHtmlTable } from "react-csv-to-table";

export const CSVTable = ({ data = "" }) => {
  console.log("%c  data:", "color: #0e93e0;background: #aaefe5;", data);
  data = `
      Filename;Prompt;Prompt;Inp1;Inp2;Inp3;Inp4;Inp5;Inp6;Inp7;Inp8;Inp9;Inp10;Inp11
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Start with Purpose: Emphasize the critical role of the ACP in enhancing asset reliability, optimizing maintenance operations, and achieving organizational goals. Highlight how RCM principles serve as the program's foundation, ensuring a systematic and efficient approach.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Leadership and Stakeholder Engagement: Engage leaders from all departments impacted by the ACP. Ensure buy-in from teams responsible for asset management, maintenance, and operations, emphasizing the role of each pillar in the program's success.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Effective Communication and Trust: Communicate the advantages of integrating People, Processes, and Technology within the ACP. Provide clear examples of how RCM principles can lead to increased asset reliability and reduced downtime.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Empowerment and Involvement: Train and empower personnel across all levels, from technicians to managers, ensuring they understand their roles within the ACP and the importance of each pillar.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Comprehensive Training: Offer training on RCM methodologies, new technologies introduced in the ACP, and optimized processes for maintenance and asset management.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Iterative and Flexible Approach: Pilot the ACP in specific departments or for certain assets, gather feedback, and refine based on real-world challenges and results.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Risk Management and Preparedness: Identify potential risks related to asset failures, maintenance challenges, and technology adoption. Prepare roadmaps for the phased implementation of the ACP.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Cultural Sensitivity and Employee Well-being: Understand the existing maintenance culture and address concerns related to changes in roles, responsibilities, and workflows introduced by the ACP.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Measurement and Continuous Improvement: Establish metrics like Overall Equipment Effectiveness (OEE), Mean Time Between Failures (MTBF), and maintenance costs to gauge the ACP's success and areas for improvement.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Collaboration and Knowledge Sharing: Foster a collaborative environment where teams across the three pillars share insights, challenges, and successes. Document best practices and lessons learned from RCM implementation.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Resistance Management and Reinforcement: Address concerns related to changes in maintenance schedules, technology adoption, and new processes. Reinforce the benefits of the ACP through regular reviews and success stories.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;
      Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program).txt;"### Instruction ### 
      Write an Article with the Title: [Inp2] for forum with the title:   [Inp1] for the Audience: [Inp3] in the Style of [Inp4] with at least [Inp5] Characters.
      
      ### Context ### 
      
      Use the following content elements for the article: 	Engaging Headline: Start with a headline that grabs attention. Example: ""The Heart of Asset Care: Starting with Purpose and Relying on RCM.""
        Lead Paragraph: Open with a compelling paragraph that sets the stage for the article. Give a brief overview of what readers can expect.
        Visuals: Use relevant images, infographics, or diagrams to break the text and explain complex concepts. Visuals related to asset management or RCM can be very effective.
        Personal Anecdote: Share a brief story or experience that highlights the importance of starting with purpose in asset management. This humanizes the content and makes it relatable.
        Clear Explanation of ACP and RCM: Before diving deep, provide a concise definition of the Asset Care Program and Reliability Centered Maintenance for those unfamiliar.
        Benefits: Clearly articulate the benefits of emphasizing purpose in ACP and how RCM principles enhance asset reliability and maintenance operations.
        Real-world Examples: Offer examples or case studies where starting with purpose and employing RCM principles led to tangible improvements.
        Challenges and Solutions: Briefly touch upon challenges organizations might face when emphasizing purpose in ACP and how to overcome them using RCM.
        Bullet Points or Lists: Use these to highlight key points, making the article more scannable and easier to digest.
        Call-to-Action (CTA): Conclude by encouraging readers to take some action, whether it's implementing the principles discussed, attending a related workshop, or simply leaving a comment with their thoughts.
        Engagement: Prompt readers with a question at the end to foster discussion and engagement in the comments section.
      and write it in technical english without adjectives in a very short and precise way. 
      
      ### Input Data ### 
      • Series Title = [Inp1]
      • Titel = [Inp2]
      • Audience = [Inp3]
      • Style = [Inp4]• Characters = [Inp5]";100;Pillars of Progress: People, Processes, Technology, and Change Management in ACP (Asset Care Program);	Holistic Benefits Realization: Monitor tangible benefits like reduced maintenance costs, increased asset uptime, and enhanced reliability. Also, consider intangible benefits like improved team morale, better inter-departmental collaboration, and increased trust in the ACP.;Managers, Engineers, Technicians;Author Walter Isaacson;24500;;;;;;`;

  return (
    <CsvToHtmlTable
      tableClassName="CSVTable table-striped table-hover"
      tableRowClassName
      tableColumnClassName
      hasHeader={true}
      data={data}
      csvDelimiter=";"
    />
  );
};
